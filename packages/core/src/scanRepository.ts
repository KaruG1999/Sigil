// packages/core/src/scanRepository.ts

import fs from "fs";
import path from "path";
import { ScanFinding, ScanResult } from "./types";
import { fetchGitHubRepoToTemp } from "./fetchGitHubRepoToTemp";

// RISK TYPE
type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

function isGitHubUrl(str: string): boolean {
  return str.startsWith("https://github.com/");
}

// DIRECTORIES TO IGNORE
const IGNORE_DIRS = new Set(["node_modules", ".git", ".next", "dist", "build"]);

// DANGEROUS STRINGS
const DANGEROUS_STRINGS: string[] = [
  "rm -rf",
  "child_process.exec",
  "child_process.spawn",
  "curl http",
  "wget http",
  "eval(",
  "atob(",
  "window.eval",
  "fetch('http://",
  "fetch(\"http://",
  "crypto.subtle.exportKey"
];

// PRIVATE KEYS
const PRIVATE_KEY_PATTERNS: RegExp[] = [
  /-----BEGIN PRIVATE KEY-----/i,
  /AIza[0-9A-Za-z\-_]{35}/,
  /sk_live_[0-9a-zA-Z]{24}/,
  /secret[_-]?(key)?["'=:\s]/i,
  /0x[a-fA-F0-9]{64}/,
];

// SUSPICIOUS DEPENDENCIES
const SUSPICIOUS_DEPENDENCIES = [
  "shelljs",
  "child-process-promise",
  "crypto-js",
  "axios@0.21.1"
];

// READ ALL FILES
function readAllFiles(root: string): string[] {
  const results: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);

      if (fs.statSync(fullPath).isDirectory()) {
        if (IGNORE_DIRS.has(entry)) continue;
        walk(fullPath);
      } else {
        results.push(fullPath);
      }
    }
  }

  walk(root);
  return results;
}

// RISK SCORE → LEVEL
function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "LOW";
  if (score >= 40) return "MEDIUM";
  return "HIGH";
}

// SUMMARY GENERATOR
function getSummary(findings: ScanFinding[]): string {
  if (findings.length === 0) return "No obvious threats detected.";

  const high = findings.filter(f => f.type === "high").length;
  const medium = findings.filter(f => f.type === "medium").length;

  if (high > 0) return "High-risk indicators detected in the repository.";
  if (medium > 0) return "Some medium-risk issues were detected.";

  return "Minor informational issues found.";
}

// MAIN SCAN
export async function scanRepository(repoPath: string): Promise<ScanResult> {
  const findings: ScanFinding[] = [];

  // A) IF URL → DOWNLOAD ZIP → USE TEMP FOLDER
  if (isGitHubUrl(repoPath)) {
    try {
      repoPath = await fetchGitHubRepoToTemp(repoPath);
      console.log("Downloaded GitHub repo to:", repoPath);
    } catch (e) {
      return {
        score: 0,
        riskLevel: "HIGH",
        summary: "Failed to download GitHub repository.",
        findings: [
          { type: "high", message: "GitHub download failed: " + (e as Error).message }
        ]
      };
    }
  }

  // B) Validate repo exists
  if (!fs.existsSync(repoPath)) {
    return {
      score: 0,
      riskLevel: "HIGH",
      summary: `Repository not found: ${repoPath}`,
      findings: [{ type: "high", message: `Repository not found: ${repoPath}` }]
    };
  }

  let files: string[] = [];

  try {
    files = readAllFiles(repoPath);
  } catch (err) {
    findings.push({
      type: "high",
      message: `Failed reading repository: ${(err as Error).message}`
    });

    return {
      score: 20,
      riskLevel: "HIGH",
      summary: "Failed to read repository structure.",
      findings
    };
  }

  // C) ANALYZE FILE CONTENTS
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, "utf8");

      // 1) Dangerous strings
      for (const danger of DANGEROUS_STRINGS) {
        if (content.includes(danger)) {
          findings.push({
            type: "high",
            message: `Dangerous string "${danger}" found in ${filePath}`,
            file: filePath
          });
        }
      }

      // 2) Private keys
      for (const pattern of PRIVATE_KEY_PATTERNS) {
        if (pattern.test(content)) {
          findings.push({
            type: "high",
            message: `Potential private key exposed in ${filePath}`,
            file: filePath
          });
        }
      }

    } catch {
      findings.push({
        type: "medium",
        message: `Unable to read file: ${filePath}`,
        file: filePath
      });
    }
  }

  // D) CHECK package.json
  const pkgJsonPath = path.join(repoPath, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));

      const deps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {})
      };

      for (const dep of Object.keys(deps)) {
        if (SUSPICIOUS_DEPENDENCIES.includes(dep)) {
          findings.push({
            type: "medium",
            message: `Suspicious dependency detected: ${dep}`
          });
        }
      }

      if (pkg.scripts?.postinstall) {
        findings.push({
          type: "high",
          message: `postinstall script detected: "${pkg.scripts.postinstall}" (executes code on install)`
        });
      }

    } catch {
      findings.push({
        type: "medium",
        message: "Could not parse package.json"
      });
    }
  }

  // E) SCORE
  let score = 100;
  for (const f of findings) {
    if (f.type === "high") score -= 40;
    if (f.type === "medium") score -= 15;
  }
  if (score < 0) score = 0;

  // F) FINAL RESULT
  const riskLevel = getRiskLevel(score);
  const summary = getSummary(findings);

  return { score, riskLevel, summary, findings };
}

export default scanRepository;
