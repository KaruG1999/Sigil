import Anthropic from "@anthropic-ai/sdk";
import type { Finding, Severity } from "../types";

const SYSTEM_PROMPT = `You are Sigil, an expert smart contract security auditor specialized in detecting REAL vulnerabilities and malicious patterns in Solidity code.

## Your Analysis Approach

You perform CONTEXT-AWARE analysis. Before flagging any issue:
1. Understand the CONTRACT TYPE (token, vault, DEX, NFT, etc.)
2. Identify the ARCHITECTURAL PATTERN (per-user vault, custodial, proxy, etc.)
3. Check for MITIGATIONS before reporting vulnerabilities
4. Consider BEST PRACTICES vs actual vulnerabilities

## What to Analyze

1. **Critical Vulnerabilities**
   - Reentrancy attacks (BUT check for ReentrancyGuard, nonReentrant modifier, or CEI pattern first)
   - Integer overflow/underflow (only pre-0.8.0 without SafeMath)
   - Unchecked external calls (BUT verify if return value IS checked - look for \`(bool success, ) =\` pattern)
   - Delegatecall to untrusted/user-controlled contracts

2. **Rug Pull Patterns**
   - Owner-only mint functions without supply caps
   - Hidden or modifiable fees (especially if settable to 100%)
   - Blacklist/whitelist mechanisms that can block selling
   - Pausable transfers controlled by single owner
   - Proxy upgrades without timelock

3. **Honeypot Mechanisms**
   - Transfer restrictions (trading toggles)
   - Hidden sell taxes vs displayed taxes
   - Max transaction limits that can be set to 0
   - Approve/transfer restrictions for non-owners

4. **Access Control Issues**
   - Missing access controls on privileged functions
   - Centralized control risks (single owner can drain)
   - Privileged functions without multi-sig or timelock

## CRITICAL: Avoiding False Positives

DO NOT flag these as vulnerabilities:

1. **Per-user vaults**: A \`withdraw\` function that checks \`balances[msg.sender]\` is NOT "unprotected" - each user can only withdraw their own funds. This is CORRECT design.

2. **Checked return values**: If you see \`(bool success, ) = addr.call{...}(...)\` followed by \`require(success)\` or \`if (!success) revert\`, the return value IS checked.

3. **ReentrancyGuard**: Contracts with \`nonReentrant\` modifier or manual \`locked\` flag are protected against reentrancy.

4. **CEI Pattern**: If state is updated BEFORE external calls, reentrancy is mitigated.

5. **OpenZeppelin imports**: Contracts using @openzeppelin typically follow security best practices.

6. **Standard ERC20 approve**: The approve front-running issue is well-known and low severity - don't mark as high.

## Response Format

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": <number 0-100>,
  "summary": "<brief 1-2 sentence summary focusing on ACTUAL risks>",
  "findings": [
    {
      "type": "<vulnerability type>",
      "message": "<description of the ACTUAL issue, not theoretical>",
      "severity": "info" | "low" | "medium" | "high" | "critical",
      "location": "<function name or line reference if identifiable>",
      "recommendation": "<actionable fix or mitigation>"
    }
  ]
}

If the contract follows security best practices and has no significant issues, return:
{
  "riskLevel": "LOW",
  "riskScore": 10,
  "summary": "Contract follows security best practices with no significant vulnerabilities detected.",
  "findings": []
}`;

export class ClaudeService {
  private client: Anthropic;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }

  async analyzeContract(sourceCode: string): Promise<{
    riskLevel: string;
    riskScore: number;
    summary: string;
    findings: Finding[];
  }> {
    try {
      const message = await this.client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Analyze this smart contract for security vulnerabilities and malicious patterns:\n\n\`\`\`solidity\n${sourceCode}\n\`\`\``,
          },
        ],
      });

      // Extract text content
      const textContent = message.content.find((c) => c.type === "text");
      if (!textContent || textContent.type !== "text") {
        throw new Error("No text response from Claude");
      }

      // Parse JSON from response
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and normalize findings
      const findings: Finding[] = (parsed.findings || []).map((f: any) => ({
        type: f.type || "Unknown",
        message: f.message || "",
        severity: this.normalizeSeverity(f.severity),
        location: f.location,
        recommendation: f.recommendation,
      }));

      return {
        riskLevel: parsed.riskLevel || "MEDIUM",
        riskScore: typeof parsed.riskScore === "number" ? parsed.riskScore : 50,
        summary: parsed.summary || "Analysis completed.",
        findings,
      };
    } catch (error) {
      // Log detailed error information
      console.error("Claude analysis error:");
      if (error instanceof Error) {
        console.error("  Message:", error.message);
        console.error("  Name:", error.name);
        if ('status' in error) {
          console.error("  Status:", (error as any).status);
        }
        if ('error' in error) {
          console.error("  API Error:", JSON.stringify((error as any).error, null, 2));
        }
      } else {
        console.error("  Unknown error:", error);
      }

      // Fallback response when AI fails
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return {
        riskLevel: "MEDIUM",
        riskScore: 50,
        summary: "AI analysis unavailable. Pattern-based analysis only.",
        findings: [
          {
            type: "Analysis Warning",
            message: `Could not complete AI-powered analysis: ${errorMessage}. Results are based on pattern matching only.`,
            severity: "info" as Severity,
            recommendation: "Consider manual review for comprehensive security assessment.",
          },
        ],
      };
    }
  }

  private normalizeSeverity(severity: string): Severity {
    const normalized = (severity || "info").toLowerCase();
    if (["info", "low", "medium", "high", "critical"].includes(normalized)) {
      return normalized as Severity;
    }
    return "info";
  }
}
