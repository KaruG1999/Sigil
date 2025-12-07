import { ScanResult, ScanFinding } from "./types";

// Minimal mock implementation for MVP
// Returns a deterministic ScanResult so API/CLI can be wired and tested.
export async function scanRepository(_target: string): Promise<ScanResult> {
  const findings: ScanFinding[] = [{ type: "info", message: "MVP mock scan: no analysis performed" }];
  return { score: 100, findings };
}

export default scanRepository;
