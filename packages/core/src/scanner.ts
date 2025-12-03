// packages/core/src/scanner.ts
import type { ScanOutput, Finding } from "./types";

/**
 * Applies simple pseudo-realistic heuristics based on repo URL patterns.
 * This is perfect for MVP + Hackathon demo.
 */
export async function scanRepository(repoUrl: string): Promise<ScanOutput> {
  await new Promise(r => setTimeout(r, 1500)); // Simulate latency

  const url = repoUrl.toLowerCase();
  const findings: Finding[] = [];

  // Pattern 1: Wallet repos -> high risk
  if (url.includes("wallet")) {
    findings.push(
      {
        type: "Malicious Script",
        message: "Detected suspicious obfuscated JS referencing crypto transactions."
      },
      {
        type: "Unknown Binary",
        message: "Found precompiled binary inside /native/ folder."
      }
    );
  }

  // Pattern 2: Repos ending in .git -> medium risk
  if (url.endsWith(".git")) {
    findings.push({
      type: "Shadow Clone",
      message: "Repository URL ends in .git — often used in spoof repos."
    });
  }

  // Pattern 3: "test" or "demo" repos → low or no risk
  if (url.includes("test") || url.includes("demo") || url.includes("playground")) {
    return {
      riskLevel: "LOW",
      summary: "No significant anomalies found. Repository appears safe.",
      findings: []
    };
  }

  // Pattern 4: npm abuse
  if (url.includes("node") || url.includes("npm")) {
    findings.push({
      type: "Dependency Anomaly",
      message: "Detected dependency mismatch indicating potential supply chain tampering."
    });
  }

  // Pattern 5: Random chance
  if (findings.length === 0) {
    findings.push({
      type: "Suspicious Pattern",
      message: "Entropy levels slightly above normal. Manual review recommended."
    });
  }

  // Assign risk level based on # of findings
  const riskLevel: ScanOutput["riskLevel"] =
    findings.length >= 3 ? "HIGH" :
    findings.length === 2 ? "MEDIUM" :
    "LOW";

  return {
    riskLevel,
    summary: getSummaryForRisk(riskLevel),
    findings
  };
}

function getSummaryForRisk(level: "LOW" | "MEDIUM" | "HIGH") {
  if (level === "LOW") return "No major threats detected.";
  if (level === "MEDIUM") return "Some suspicious activity was detected.";
  return "Critical signs of malicious behavior detected.";
}
