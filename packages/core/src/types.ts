// packages/core/src/types.ts
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Finding {
  type: string;
  message: string;
}

export interface ScanOutput {
  riskLevel: RiskLevel;
  summary: string;
  findings: Finding[];
}
