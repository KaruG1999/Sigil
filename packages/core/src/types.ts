// packages/core/src/types.ts

// Risk Levels
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Severity = "info" | "low" | "medium" | "high" | "critical";

// Input types
export type ScanInputType = "contract" | "code" | "repo";

export interface ScanInput {
  type: ScanInputType;
  input: string; // address, code, or URL
  network?: NetworkType;
}

// Networks
export type NetworkType =
  | "ethereum"
  | "polygon"
  | "bsc"
  | "arbitrum"
  | "optimism"
  | "base";

export interface NetworkConfig {
  chainId: number;
  name: string;
  explorerApi: string;
  explorerApiKey?: string;
}

// Findings
export interface Finding {
  type: string;
  message: string;
  severity: Severity;
  location?: string;
  recommendation?: string;
}

// Contract Info
export interface ContractInfo {
  address: string;
  name?: string;
  compiler?: string;
  verified: boolean;
  sourceCode?: string;
  abi?: any[];
}

// Scan Output
export interface ScanOutput {
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  summary: string;
  findings: Finding[];
  contractInfo?: ContractInfo;
  analyzedAt: string;
  analysisType: ScanInputType;
}

// Vulnerability patterns
export interface VulnerabilityPattern {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  pattern: RegExp;
  recommendation: string;
}
