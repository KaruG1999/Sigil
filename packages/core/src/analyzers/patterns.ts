import type { Finding, VulnerabilityPattern, Severity } from "../types";

const MALICIOUS_PATTERNS: VulnerabilityPattern[] = [
  // ==================== RUG PULL PATTERNS ====================
  {
    id: "rug-001",
    name: "Owner Mint Function",
    description: "Owner can mint unlimited tokens, potentially diluting value",
    severity: "critical",
    pattern: /function\s+\w*[Mm]int\w*\s*\([^)]*\)\s*(?:external|public)[^{]*(?:onlyOwner|onlyRole)/,
    recommendation: "Add a maximum supply cap or remove owner-only minting",
  },
  {
    id: "rug-002",
    name: "Modifiable Fees",
    description: "Transaction fees can be modified by owner, potentially to 100%",
    severity: "high",
    pattern: /function\s+set(?:Tax|Fee|Sell|Buy|Transfer)(?:Fee|Percent|Rate)\w*\s*\([^)]*uint/i,
    recommendation: "Add maximum fee limits or use immutable fees",
  },
  {
    id: "rug-003",
    name: "Blacklist Mechanism",
    description: "Contract can blacklist addresses from trading",
    severity: "high",
    pattern: /(?:mapping\s*\([^)]*\)\s*(?:public|private|internal)?\s*(?:blacklist|blocked|banned|isBlacklisted))|(?:function\s+(?:blacklist|block|ban)\w*\s*\()/i,
    recommendation: "Blacklists can prevent legitimate holders from selling",
  },
  {
    id: "rug-004",
    name: "Pausable Transfers",
    description: "Token transfers can be paused by owner",
    severity: "high",
    pattern: /(?:whenNotPaused|require\s*\(\s*!?\s*paused)|(?:function\s+pause\s*\(\s*\))/i,
    recommendation: "Pausable tokens can trap holder funds",
  },
  {
    id: "rug-005",
    name: "Hidden Owner",
    description: "Complex ownership patterns that may hide control",
    severity: "medium",
    pattern: /function\s+\w*[Tt]ransferOwner\w*[^{]*\{[^}]*(?:!=|==)\s*address\s*\(\s*0\s*\)/,
    recommendation: "Verify ownership is transparent and properly renounced",
  },

  // ==================== HONEYPOT PATTERNS ====================
  {
    id: "honey-001",
    name: "Trading Toggle",
    description: "Trading can be enabled/disabled by owner",
    severity: "critical",
    pattern: /(?:require\s*\([^)]*(?:tradingEnabled|canTrade|tradingActive|launched|isLaunched))|(?:function\s+(?:enableTrading|startTrading|launch)\s*\()/i,
    recommendation: "Owner can disable selling at any time",
  },
  {
    id: "honey-002",
    name: "Max Transaction Limit",
    description: "Max transaction can be set to prevent large sells",
    severity: "medium",
    pattern: /(?:require\s*\([^)]*(?:maxTx|maxTransaction|maxTransfer|_maxTxAmount))|(?:function\s+setMax(?:Tx|Transaction)\w*\s*\()/i,
    recommendation: "Verify max limits are reasonable and cannot be set to 0",
  },
  {
    id: "honey-003",
    name: "Transfer Cooldown",
    description: "Cooldown between transfers can trap funds",
    severity: "medium",
    pattern: /(?:cooldown|transferDelay|lastTransfer)\s*\[/i,
    recommendation: "Cooldowns can prevent timely selling",
  },
  {
    id: "honey-004",
    name: "Anti-Bot Mechanism",
    description: "Anti-bot code that may block legitimate users",
    severity: "medium",
    pattern: /(?:isBot|antiBot|botProtection|sniperProtection)\s*[\[\(]/i,
    recommendation: "Anti-bot mechanisms can be used to block any address",
  },

  // ==================== CRITICAL VULNERABILITIES ====================
  {
    id: "vuln-001",
    name: "Reentrancy Risk",
    description: "External call before state update (potential reentrancy)",
    severity: "critical",
    pattern: /\.call\{[^}]*value[^}]*\}\s*\([^)]*\)[\s\S]{0,50}(?:balance|_balance|balanceOf)/,
    recommendation: "Use checks-effects-interactions pattern or ReentrancyGuard",
  },
  {
    id: "vuln-002",
    name: "Unchecked Return Value",
    description: "External call return value not checked",
    severity: "high",
    pattern: /\.call\{[^}]*\}\s*\([^)]*\)\s*;/,
    recommendation: "Always check return values: (bool success, ) = addr.call{...}(...)",
  },
  {
    id: "vuln-003",
    name: "Delegatecall Usage",
    description: "Delegatecall can execute arbitrary code in contract context",
    severity: "high",
    pattern: /\.delegatecall\s*\(/,
    recommendation: "Delegatecall to untrusted contracts is dangerous",
  },

  // ==================== DANGEROUS FUNCTIONS ====================
  {
    id: "danger-001",
    name: "Self-Destruct",
    description: "Contract can be permanently destroyed",
    severity: "critical",
    pattern: /selfdestruct\s*\(|suicide\s*\(/,
    recommendation: "Contract destruction will send all ETH to specified address",
  },
  {
    id: "danger-002",
    name: "Arbitrary External Call",
    description: "Function allows arbitrary external calls",
    severity: "critical",
    pattern: /function\s+\w+\s*\([^)]*address[^)]*\)[^{]*\{[\s\S]*?\.call\{/,
    recommendation: "Arbitrary calls can drain contract funds",
  },
  {
    id: "danger-003",
    name: "Unprotected ETH Withdrawal",
    description: "ETH withdrawal without proper access control",
    severity: "critical",
    pattern: /function\s+(?:withdraw|drain|sweep)\w*\s*\([^)]*\)\s*(?:external|public)[^{]*\{[^}]*(?:transfer|send|call\{)/i,
    recommendation: "Ensure withdrawal functions have proper access controls",
  },

  // ==================== ACCESS CONTROL ====================
  {
    id: "access-001",
    name: "Missing Access Control",
    description: "Sensitive function may lack access control",
    severity: "high",
    pattern: /function\s+(?:set|update|change|modify)\w*\s*\([^)]*\)\s*(?:external|public)\s*\{/,
    recommendation: "Add onlyOwner or role-based access control",
  },
  {
    id: "access-002",
    name: "Single Point of Failure",
    description: "Critical functions controlled by single owner",
    severity: "medium",
    pattern: /onlyOwner[^{]*\{[\s\S]*?(?:selfdestruct|delegatecall|\.call\{)/,
    recommendation: "Consider multi-sig or timelock for critical operations",
  },

  // ==================== TOKEN SPECIFIC ====================
  {
    id: "token-001",
    name: "Approve Front-Running",
    description: "Standard approve vulnerable to front-running",
    severity: "low",
    pattern: /function\s+approve\s*\(\s*address\s+\w+\s*,\s*uint/,
    recommendation: "Consider using increaseAllowance/decreaseAllowance pattern",
  },
  {
    id: "token-002",
    name: "Hidden Transfer Fee",
    description: "Transfer function contains fee logic",
    severity: "medium",
    pattern: /function\s+_?transfer\s*\([^)]*\)[^{]*\{[\s\S]*?(?:fee|tax|percent)/i,
    recommendation: "Review fee calculation for hidden or excessive fees",
  },
];

export function analyzePatterns(sourceCode: string): Finding[] {
  const findings: Finding[] = [];
  const detectedIds = new Set<string>();

  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.pattern.test(sourceCode) && !detectedIds.has(pattern.id)) {
      detectedIds.add(pattern.id);
      findings.push({
        type: pattern.name,
        message: pattern.description,
        severity: pattern.severity,
        recommendation: pattern.recommendation,
      });
    }
  }

  return findings;
}

export { MALICIOUS_PATTERNS };
