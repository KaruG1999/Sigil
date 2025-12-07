// packages/core/src/types.ts
// MVP types: keep names and shape exactly as requested
export interface ScanFinding { type: string; message: string; }

export interface ScanResult { score: number; findings: ScanFinding[]; }
