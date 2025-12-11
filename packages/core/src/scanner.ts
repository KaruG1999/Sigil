import { EtherscanService } from "./services/etherscan";
import { ClaudeService } from "./services/claude";
import { analyzePatterns } from "./analyzers/patterns";
import type {
  ScanInput,
  ScanOutput,
  RiskLevel,
  Finding,
  ContractInfo,
} from "./types";

export interface ScannerConfig {
  etherscanApiKey?: string;
  claudeApiKey?: string;
}

export class VibeSafeScanner {
  private etherscan: EtherscanService;
  private claude: ClaudeService;

  constructor(config?: ScannerConfig) {
    this.etherscan = new EtherscanService(config?.etherscanApiKey);
    this.claude = new ClaudeService(config?.claudeApiKey);
  }

  async scan(input: ScanInput): Promise<ScanOutput> {
    try {
      let sourceCode: string;
      let contractInfo: ContractInfo | undefined;

      // Get source code based on input type
      if (input.type === "contract") {
        // Validate address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(input.input)) {
          return this.createErrorResult(
            "Invalid contract address format. Expected 0x followed by 40 hex characters.",
            input.type
          );
        }

        // Fetch from blockchain explorer
        contractInfo = await this.etherscan.getContractSource(
          input.input,
          input.network || "ethereum"
        );

        if (!contractInfo.verified) {
          return {
            riskLevel: "HIGH",
            riskScore: 75,
            summary: "Contract source code is not verified. Cannot perform code analysis.",
            findings: [
              {
                type: "Unverified Contract",
                message:
                  "This contract's source code is not verified on the blockchain explorer. Unverified contracts pose significant risks as their behavior cannot be audited.",
                severity: "high",
                recommendation:
                  "Only interact with verified contracts. Request the team to verify their contract.",
              },
            ],
            contractInfo,
            analyzedAt: new Date().toISOString(),
            analysisType: input.type,
          };
        }

        sourceCode = contractInfo.sourceCode!;
      } else if (input.type === "code") {
        // Direct code input
        if (!input.input.trim()) {
          return this.createErrorResult(
            "No source code provided.",
            input.type
          );
        }
        sourceCode = input.input;
      } else {
        return this.createErrorResult(
          `Unsupported input type: ${input.type}`,
          input.type
        );
      }

      // Run pattern analysis (fast, local)
      const patternFindings = analyzePatterns(sourceCode);

      // Run AI analysis
      const aiAnalysis = await this.claude.analyzeContract(sourceCode);

      // Merge and deduplicate findings
      const allFindings = this.mergeFindings(patternFindings, aiAnalysis.findings);

      // Calculate final risk score
      const riskScore = this.calculateRiskScore(allFindings);
      const riskLevel = this.getRiskLevel(riskScore);

      // Generate summary
      const summary = this.generateSummary(riskLevel, allFindings, aiAnalysis.summary);

      return {
        riskLevel,
        riskScore,
        summary,
        findings: allFindings,
        contractInfo,
        analyzedAt: new Date().toISOString(),
        analysisType: input.type,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return this.createErrorResult(message, input.type);
    }
  }

  private mergeFindings(patternFindings: Finding[], aiFindings: Finding[]): Finding[] {
    const merged: Finding[] = [...patternFindings];
    const existingTypes = new Set(patternFindings.map((f) => f.type.toLowerCase()));

    for (const finding of aiFindings) {
      // Avoid duplicates based on similar type names
      const typeKey = finding.type.toLowerCase();
      if (!existingTypes.has(typeKey)) {
        merged.push(finding);
        existingTypes.add(typeKey);
      }
    }

    // Sort by severity (critical first)
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    merged.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return merged;
  }

  private calculateRiskScore(findings: Finding[]): number {
    let score = 0;

    for (const finding of findings) {
      switch (finding.severity) {
        case "critical":
          score += 25;
          break;
        case "high":
          score += 15;
          break;
        case "medium":
          score += 8;
          break;
        case "low":
          score += 3;
          break;
        case "info":
          score += 1;
          break;
      }
    }

    return Math.min(100, score);
  }

  private getRiskLevel(score: number): RiskLevel {
    if (score >= 70) return "CRITICAL";
    if (score >= 45) return "HIGH";
    if (score >= 20) return "MEDIUM";
    return "LOW";
  }

  private generateSummary(
    riskLevel: RiskLevel,
    findings: Finding[],
    aiSummary: string
  ): string {
    const criticalCount = findings.filter((f) => f.severity === "critical").length;
    const highCount = findings.filter((f) => f.severity === "high").length;

    if (riskLevel === "CRITICAL") {
      return `CRITICAL RISK: Found ${criticalCount} critical and ${highCount} high severity issues. ${aiSummary}`;
    } else if (riskLevel === "HIGH") {
      return `HIGH RISK: Found ${highCount} high severity issues requiring attention. ${aiSummary}`;
    } else if (riskLevel === "MEDIUM") {
      return `MEDIUM RISK: Some concerns detected. ${aiSummary}`;
    }
    return `LOW RISK: No major issues detected. ${aiSummary}`;
  }

  private createErrorResult(message: string, analysisType: ScanInput["type"]): ScanOutput {
    return {
      riskLevel: "HIGH",
      riskScore: 50,
      summary: `Analysis failed: ${message}`,
      findings: [
        {
          type: "Analysis Error",
          message,
          severity: "high",
          recommendation: "Please try again or contact support if the issue persists.",
        },
      ],
      analyzedAt: new Date().toISOString(),
      analysisType,
    };
  }
}

// Convenience function for simple usage
export async function scan(input: ScanInput): Promise<ScanOutput> {
  const scanner = new VibeSafeScanner();
  return scanner.scan(input);
}
