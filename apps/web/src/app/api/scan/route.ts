import { NextResponse } from "next/server";

const API_URL = process.env.VIBESAFE_API_URL || "http://localhost:4000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, input, network } = body;

    // Validate required fields
    if (!type || !input) {
      return NextResponse.json(
        { error: "Missing required fields: type and input" },
        { status: 400 }
      );
    }

    // Proxy to Anouk's backend API
    const response = await fetch(`${API_URL}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, input, network: network || "ethereum" }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Transform response to match frontend expectations
    return NextResponse.json({
      score: data.riskScore ?? 0,
      riskLevel: data.riskLevel ?? "LOW",
      summary: data.summary ?? "",
      findings: data.findings ?? [],
    });
  } catch (err) {
    console.error("Scan API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to connect to scanner API" },
      { status: 500 }
    );
  }
}
