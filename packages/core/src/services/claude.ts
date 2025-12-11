import Anthropic from "@anthropic-ai/sdk";
import type { Finding, Severity } from "../types";

const SYSTEM_PROMPT = `You are VibeSafe, an expert smart contract security auditor specialized in detecting vulnerabilities and malicious patterns in Solidity code.

Analyze the provided smart contract code for:

1. **Critical Vulnerabilities**
   - Reentrancy attacks
   - Integer overflow/underflow (pre-0.8.0)
   - Unchecked external calls
   - Delegatecall to untrusted contracts

2. **Rug Pull Patterns**
   - Owner-only mint functions without caps
   - Hidden fee modifications
   - Blacklist/whitelist mechanisms
   - Pausable transfers controlled by owner
   - Proxy upgrades without timelock

3. **Honeypot Mechanisms**
   - Transfer restrictions
   - Hidden sell taxes
   - Max transaction limits that can be set to 0
   - Approve restrictions

4. **Access Control Issues**
   - Missing access controls
   - Centralized control risks
   - Privileged functions without multi-sig

5. **Other Security Concerns**
   - Gas griefing
   - Front-running vulnerabilities
   - Timestamp manipulation
   - Unsafe external calls

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": <number 0-100>,
  "summary": "<brief 1-2 sentence summary>",
  "findings": [
    {
      "type": "<vulnerability type>",
      "message": "<description of the issue>",
      "severity": "info" | "low" | "medium" | "high" | "critical",
      "location": "<function name or line reference if identifiable>",
      "recommendation": "<how to fix or mitigate>"
    }
  ]
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
      console.error("Claude analysis error:", error);

      // Fallback response when AI fails
      return {
        riskLevel: "MEDIUM",
        riskScore: 50,
        summary: "AI analysis unavailable. Pattern-based analysis only.",
        findings: [
          {
            type: "Analysis Warning",
            message: "Could not complete AI-powered analysis. Results are based on pattern matching only.",
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
