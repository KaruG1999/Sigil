import type { Finding, VulnerabilityPattern, Severity } from "../types";

// ============================================================================
// SAFE PATTERNS - Used to suppress false positives
// ============================================================================

interface SafePattern {
  id: string;
  description: string;
  pattern: RegExp;
  suppressesVulnerabilities: string[]; // List of vulnerability IDs to suppress
}

const SAFE_PATTERNS: SafePattern[] = [
  // Checked return value - suppresses unchecked call warning
  {
    id: "safe-001",
    description: "Return value is captured and checked",
    pattern: /\(\s*bool\s+\w+\s*,?\s*\)\s*=\s*\w+\.call\{/,
    suppressesVulnerabilities: ["vuln-002"],
  },
  // ReentrancyGuard - suppresses reentrancy warning
  {
    id: "safe-002",
    description: "Contract uses ReentrancyGuard",
    pattern: /(?:nonReentrant|ReentrancyGuard|_notEntered|locked\s*=\s*true)/,
    suppressesVulnerabilities: ["vuln-001"],
  },
  // User balance check before withdrawal - indicates per-user vault
  {
    id: "safe-003",
    description: "Withdrawal protected by user balance check",
    pattern: /(?:balances?\s*\[\s*msg\.sender\s*\]|_balances?\s*\[\s*msg\.sender\s*\])\s*(?:<|>=?|==)/,
    suppressesVulnerabilities: ["danger-003"],
  },
  // Balance update before external call (CEI pattern)
  {
    id: "safe-004",
    description: "Follows checks-effects-interactions pattern",
    pattern: /balances?\s*\[\s*msg\.sender\s*\]\s*[-+]?=[\s\S]{0,100}\.call\{/,
    suppressesVulnerabilities: ["vuln-001"],
  },
  // OpenZeppelin imports indicate professional patterns
  {
    id: "safe-005",
    description: "Uses OpenZeppelin security contracts",
    pattern: /import\s+["']@openzeppelin\/contracts/,
    suppressesVulnerabilities: ["vuln-001", "vuln-002", "access-001"],
  },
  // Explicit success check after call
  {
    id: "safe-006",
    description: "Call success is explicitly verified",
    pattern: /\.call\{[^}]*\}\s*\([^)]*\)\s*;[\s\S]{0,30}(?:require\s*\(\s*success|if\s*\(\s*!?\s*success)/,
    suppressesVulnerabilities: ["vuln-002"],
  },
  // Inline success check (standard pattern)
  {
    id: "safe-007",
    description: "Inline success verification",
    pattern: /\(\s*bool\s+success[\s\S]{0,50}if\s*\(\s*!success\s*\)/,
    suppressesVulnerabilities: ["vuln-002"],
  },
  // Custom error on failure
  {
    id: "safe-008",
    description: "Reverts on transfer failure",
    pattern: /\.call\{[\s\S]{0,100}revert\s+\w*(?:Transfer|Call|Send)?\w*Failed/i,
    suppressesVulnerabilities: ["vuln-002"],
  },
];

// ============================================================================
// MALICIOUS PATTERNS - Vulnerability detection
// ============================================================================

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
    // More specific: looks for .call{value} followed by state update (not before)
    pattern: /\.call\{[^}]*value[^}]*\}\s*\([^)]*\)[\s\S]{0,100}(?:balances?\s*\[|_balances?\s*\[)[\s\S]{0,30}(?:=\s*0|=\s*balance|-=)/,
    recommendation: "Use checks-effects-interactions pattern or ReentrancyGuard",
  },
  {
    id: "vuln-002",
    name: "Unchecked Return Value",
    description: "External call return value not checked",
    severity: "high",
    // Only matches when there's NO variable assignment before .call
    // Uses negative lookbehind simulation by checking for patterns that DON'T have assignment
    pattern: /(?:^|[;\{\}])\s*(?:\w+\.)*\w+\.call\{[^}]*\}\s*\([^)]*\)\s*;/m,
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
    pattern: /function\s+\w+\s*\([^)]*address[^)]*,\s*bytes[^)]*\)[^{]*\{[\s\S]*?\.call\{/,
    recommendation: "Arbitrary calls can drain contract funds",
  },
  {
    id: "danger-003",
    name: "Unprotected ETH Withdrawal",
    description: "ETH withdrawal without proper access control",
    severity: "critical",
    // More specific: only matches owner-controlled withdrawal to arbitrary address
    // NOT per-user withdrawals with balance checks
    pattern: /function\s+(?:withdraw|drain|sweep|emergencyWithdraw)\w*\s*\([^)]*\)\s*(?:external|public)[^{]*(?:onlyOwner|onlyRole)[^{]*\{[^}]*(?:transfer|send|call\{)[^}]*(?:owner|_owner|admin)/i,
    recommendation: "Ensure withdrawal functions have proper access controls and limits",
  },

  // ==================== ACCESS CONTROL ====================
  {
    id: "access-001",
    name: "Missing Access Control",
    description: "Sensitive function may lack access control",
    severity: "high",
    // More specific: setter functions that modify critical state without onlyOwner
    pattern: /function\s+(?:set|update|change|modify)(?:Owner|Admin|Fee|Tax|Rate|Limit)\w*\s*\([^)]*\)\s*(?:external|public)\s*(?!\s*(?:onlyOwner|onlyRole|onlyAdmin))\s*\{/,
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

// ============================================================================
// CONTEXT-AWARE ANALYSIS
// ============================================================================

interface CodeContext {
  hasReentrancyGuard: boolean;
  hasCheckedReturnValue: boolean;
  hasUserBalanceCheck: boolean;
  followsCEIPattern: boolean;
  usesOpenZeppelin: boolean;
  hasSuccessCheck: boolean;
  hasCustomErrorOnFailure: boolean;
}

function analyzeCodeContext(sourceCode: string): CodeContext {
  return {
    hasReentrancyGuard: /(?:nonReentrant|ReentrancyGuard|locked\s*=\s*true)/.test(sourceCode),
    hasCheckedReturnValue: /\(\s*bool\s+\w+\s*,?\s*\)\s*=\s*\w+\.call\{/.test(sourceCode),
    hasUserBalanceCheck: /balances?\s*\[\s*msg\.sender\s*\]\s*(?:<|>=?|-)/.test(sourceCode),
    followsCEIPattern: /balances?\s*\[\s*msg\.sender\s*\]\s*[-+]?=[\s\S]{0,50}\.call\{/.test(sourceCode),
    usesOpenZeppelin: /import\s+["']@openzeppelin/.test(sourceCode),
    hasSuccessCheck: /(?:\(\s*bool\s+success|if\s*\(\s*!?\s*success|require\s*\(\s*success)/.test(sourceCode),
    hasCustomErrorOnFailure: /\.call\{[\s\S]{0,150}revert\s+\w*(?:Transfer|Call|Send)?\w*Failed/i.test(sourceCode),
  };
}

function getSuppressedVulnerabilities(sourceCode: string): Set<string> {
  const suppressed = new Set<string>();

  for (const safePattern of SAFE_PATTERNS) {
    if (safePattern.pattern.test(sourceCode)) {
      for (const vulnId of safePattern.suppressesVulnerabilities) {
        suppressed.add(vulnId);
      }
    }
  }

  return suppressed;
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

export function analyzePatterns(sourceCode: string): Finding[] {
  const findings: Finding[] = [];
  const detectedIds = new Set<string>();

  // Analyze code context
  const context = analyzeCodeContext(sourceCode);

  // Get vulnerabilities that should be suppressed based on safe patterns
  const suppressedVulns = getSuppressedVulnerabilities(sourceCode);

  for (const pattern of MALICIOUS_PATTERNS) {
    // Skip if this vulnerability is suppressed by safe patterns
    if (suppressedVulns.has(pattern.id)) {
      continue;
    }

    // Additional context-aware filtering
    if (shouldSuppressFinding(pattern.id, context)) {
      continue;
    }

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

function shouldSuppressFinding(vulnId: string, context: CodeContext): boolean {
  switch (vulnId) {
    case "vuln-001": // Reentrancy
      return context.hasReentrancyGuard || context.followsCEIPattern;

    case "vuln-002": // Unchecked return value
      return context.hasCheckedReturnValue || context.hasSuccessCheck || context.hasCustomErrorOnFailure;

    case "danger-003": // Unprotected ETH withdrawal
      return context.hasUserBalanceCheck;

    case "access-001": // Missing access control
      return context.usesOpenZeppelin;

    default:
      return false;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { MALICIOUS_PATTERNS, SAFE_PATTERNS, analyzeCodeContext };
