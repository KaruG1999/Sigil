// packages/core/src/types.ts

export interface ScanFinding {
  type: "info" | "medium" | "high";
  message: string;
  file?: string;
}

export interface ScanResult {
  score: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  summary: string;
  findings: ScanFinding[];
}

