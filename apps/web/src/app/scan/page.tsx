"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletGate } from "@/components/WalletGate";
import { PaywallModal } from "@/components/PaywallModal";
import { useUsageTracker, FREE_SCANS } from "@/hooks/useUsageTracker";
import { ConnectButton } from "@/components/ConnectButton";
import { AppHeader } from "@/components/AppHeader";

// Networks supported by the API
const NETWORKS = [
  { id: "ethereum", name: "Ethereum", chainId: 1 },
  { id: "polygon", name: "Polygon", chainId: 137 },
  { id: "bsc", name: "BNB Chain", chainId: 56 },
  { id: "arbitrum", name: "Arbitrum", chainId: 42161 },
  { id: "optimism", name: "Optimism", chainId: 10 },
  { id: "base", name: "Base", chainId: 8453 },
];

// Icons
const IconArrowRight = () => (
  <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const IconCheck = () => (
  <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconShield = () => (
  <svg aria-hidden="true" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const IconX = () => (
  <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Types
type InputType = "contract" | "code";

type Finding = {
  type: string;
  severity: string;
  message: string;
  file?: string;
};

type ScanResult = {
  score: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  summary: string;
  findings: Finding[];
} | null;

function ScanPageContent() {
  const searchParams = useSearchParams();
  const initialAddress = searchParams.get("address") || "";
  const { address } = useAccount();

  const [inputType, setInputType] = useState<InputType>("contract");
  const [input, setInput] = useState(initialAddress);
  const [network, setNetwork] = useState("ethereum");
  const [scanState, setScanState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<ScanResult>(null);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  // Usage tracking
  const {
    scansRemaining,
    scansUsed,
    isPremium,
    canScan,
    recordScan,
    upgradeToPremium,
  } = useUsageTracker(address);

  const scanSteps = inputType === "contract"
    ? [
        { id: "fetch", label: "Fetching contract from Etherscan" },
        { id: "parse", label: "Parsing source code" },
        { id: "patterns", label: "Scanning for malicious patterns" },
        { id: "ai", label: "AI security analysis" },
        { id: "report", label: "Generating report" },
      ]
    : [
        { id: "parse", label: "Parsing source code" },
        { id: "patterns", label: "Scanning for malicious patterns" },
        { id: "ai", label: "AI security analysis" },
        { id: "report", label: "Generating report" },
      ];

  // Progress through steps during loading
  useEffect(() => {
    if (scanState === "loading") {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < scanSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [scanState, scanSteps.length]);

  const handleScan = async () => {
    // Check if user can scan
    if (!canScan) {
      setShowPaywall(true);
      return;
    }

    if (!input.trim()) {
      setError(inputType === "contract"
        ? "Please enter a valid contract address"
        : "Please paste your Solidity code");
      return;
    }

    // Validate contract address format
    if (inputType === "contract" && !/^0x[a-fA-F0-9]{40}$/.test(input.trim())) {
      setError("Invalid contract address format. Must be 0x followed by 40 hex characters.");
      return;
    }

    setScanState("loading");
    setError("");
    setResult(null);
    setCurrentStep(0);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: inputType,
          input: input.trim(),
          network
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || data.message || `Server error: ${res.status}`);
      }

      // Record the scan usage
      recordScan();

      setResult(data);
      setScanState("success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred during the scan";
      setError(errorMsg);
      setScanState("error");
    }
  };

  // Auto-start scan if address is provided in URL
  useEffect(() => {
    if (initialAddress && scanState === "idle") {
      // Intentional one-time side effect: start the scan for a ?address= link
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleScan();
    }
    // Run once on mount: auto-start only for the address that came in the URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setInput("");
    setScanState("idle");
    setResult(null);
    setError("");
    setCurrentStep(0);
  };

  const getStepStatus = (index: number): "pending" | "active" | "completed" => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  const getSeverityColor = (severity: string) => {
    const lower = severity.toLowerCase();
    if (lower === "critical" || lower === "high") return "red";
    if (lower === "medium") return "yellow";
    return "blue";
  };

  const getSeverityIcon = (severity: string) => {
    const color = getSeverityColor(severity);
    if (color === "red") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (color === "yellow") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  const getSeverityBorder = (severity: string) => {
    const color = getSeverityColor(severity);
    if (color === "red") return "border-red-500/20";
    if (color === "yellow") return "border-yellow-500/20";
    return "border-blue-500/20";
  };

  const displayInput = inputType === "contract"
    ? input
    : `${input.slice(0, 50)}${input.length > 50 ? "..." : ""}`;

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#0A0A0F] text-[#E8E8F5] relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#A57CFF]/10 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4FFFEF]/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <AppHeader
        actions={
          <>
            {/* Scans remaining badge */}
            <button
              type="button"
              onClick={() => !isPremium && setShowPaywall(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
                isPremium
                  ? "bg-gradient-to-r from-[#A57CFF]/20 to-[#4FFFEF]/20 text-[#4FFFEF] border border-[#4FFFEF]/20"
                  : scansRemaining > 0
                  ? "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                  : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              }`}
              aria-label={isPremium ? "Premium plan active" : `${scansRemaining} of ${FREE_SCANS} free scans left`}
            >
              {isPremium ? (
                <>
                  <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Premium
                </>
              ) : (
                <>
                  <span className="tabular-nums">{scansRemaining}/{FREE_SCANS}</span>
                  <span className="text-white/60">scans</span>
                </>
              )}
            </button>
            <ConnectButton className="hidden sm:inline-flex" />
          </>
        }
      />

      {/* Main Content */}
      <main className="relative z-10 min-h-[calc(100svh-4rem)] flex flex-col items-center justify-center px-4 py-12">

        {/* --- STATE: IDLE --- */}
        {scanState === "idle" && (
          <div className="w-full max-w-lg space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#A57CFF]/20 to-[#4FFFEF]/10 rounded-2xl flex items-center justify-center mb-6 motion-safe:animate-float shadow-lg shadow-[#A57CFF]/20">
                <Image src="/img/logo-mark.png" alt="" width={176} height={336} className="h-11 w-auto" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Analyze Smart Contract
              </h1>

              <p className="text-[#E8E8F5]/70 max-w-md mx-auto leading-relaxed">
                AI-powered security scanner for vulnerabilities, rug pulls, and honeypot patterns.
              </p>
            </div>

            <Card className="glass-card gap-0 p-6">
              <div className="space-y-5">
                {/* Input Type Selector */}
                <div role="group" aria-label="Input type" className="flex gap-1 rounded-lg bg-white/5 p-1">
                  <button
                    type="button"
                    aria-pressed={inputType === "contract"}
                    onClick={() => { setInputType("contract"); setInput(""); setError(""); }}
                    className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                      inputType === "contract"
                        ? "bg-[#A57CFF] text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Contract Address
                  </button>
                  <button
                    type="button"
                    aria-pressed={inputType === "code"}
                    onClick={() => { setInputType("code"); setInput(""); setError(""); }}
                    className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                      inputType === "code"
                        ? "bg-[#A57CFF] text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Paste Code
                  </button>
                </div>

                {/* Input Field */}
                {inputType === "contract" ? (
                  <div className="space-y-2">
                    <label htmlFor="scan-address" className="text-xs font-medium text-white/70 uppercase tracking-wider">
                      Contract Address
                    </label>
                    <input
                      id="scan-address"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      spellCheck={false}
                      aria-invalid={!!error}
                      aria-describedby={error ? "scan-error" : undefined}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScan()}
                      placeholder="0x..."
                      className="w-full h-12 px-4 bg-[#0A0A0F] border border-white/10 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:border-[#A57CFF] focus:ring-1 focus:ring-[#A57CFF] transition-[border-color,box-shadow] duration-150 font-mono text-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label htmlFor="scan-code" className="text-xs font-medium text-white/70 uppercase tracking-wider">
                      Solidity Code
                    </label>
                    <textarea
                      id="scan-code"
                      spellCheck={false}
                      aria-invalid={!!error}
                      aria-describedby={error ? "scan-error" : undefined}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="// Paste your Solidity code here..."
                      rows={8}
                      className="w-full px-4 py-3 bg-[#0A0A0F] border border-white/10 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:border-[#A57CFF] focus:ring-1 focus:ring-[#A57CFF] transition-[border-color,box-shadow] duration-150 font-mono text-sm resize-none"
                    />
                  </div>
                )}

                {/* Network Selector (only for contract) */}
                {inputType === "contract" && (
                  <div className="space-y-2">
                    <label htmlFor="scan-network" className="text-xs font-medium text-white/70 uppercase tracking-wider">
                      Network
                    </label>
                    <div className="relative">
                    <select
                      id="scan-network"
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                      className="w-full h-12 px-4 bg-[#0A0A0F] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#A57CFF] focus:ring-1 focus:ring-[#A57CFF] transition-[border-color,box-shadow] duration-150 text-sm appearance-none cursor-pointer pr-10"
                    >
                      {NETWORKS.map((net) => (
                        <option key={net.id} value={net.id}>
                          {net.name}
                        </option>
                      ))}
                    </select>
                    <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && scanState === "idle" && (
                  <p id="scan-error" role="alert" className="text-red-400 text-sm">{error}</p>
                )}

                <Button
                  onClick={handleScan}
                  className="btn-glow w-full h-12 text-base font-semibold bg-gradient-to-r from-[#A57CFF] to-[#7c3aed] hover:from-[#9361ff] hover:to-[#8b5cf6] text-white border-0"
                >
                  Start Security Scan
                  <IconArrowRight />
                </Button>
              </div>
            </Card>

            {/* What we check */}
            <div className="bg-[#12121A]/50 border border-white/5 rounded-lg p-5">
              <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-4">What we detect</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Rug pull patterns
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Honeypot traps
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  Reentrancy bugs
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  Access control issues
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- STATE: LOADING --- */}
        {scanState === "loading" && (
          <div role="status" className="w-full max-w-md space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
              {/* Enhanced Spinner with glow */}
              <div className="relative w-24 h-24 mx-auto">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full animate-pulse-glow" />
                {/* Background ring */}
                <div className="absolute inset-0 border-2 border-[#A57CFF]/20 rounded-full" />
                {/* Spinning ring */}
                <div className="absolute inset-0 border-2 border-transparent border-t-[#A57CFF] border-r-[#4FFFEF]/50 rounded-full animate-spin" />
                {/* Inner spinning ring (opposite direction) */}
                <div className="absolute inset-2 border-2 border-transparent border-b-[#4FFFEF]/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                {/* Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="/img/logo-mark.png" alt="" width={176} height={336} className="h-9 w-auto opacity-90 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Analyzing contract...</h2>
                <p className="text-sm text-white/60 font-mono break-all max-w-sm mx-auto">{displayInput}</p>
                {inputType === "contract" && (
                  <p className="text-xs text-[#A57CFF] mt-1">on {NETWORKS.find(n => n.id === network)?.name}</p>
                )}
              </div>
            </div>

            {/* Progress Steps with shimmer effect */}
            <Card className="glass-card gap-0 p-5 relative overflow-hidden" aria-live="polite">
              <div className="absolute inset-0 animate-shimmer" />
              <div className="relative space-y-3">
                {scanSteps.map((step, index) => {
                  const status = getStepStatus(index);
                  return (
                    <div key={step.id} className={`flex items-center gap-3`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-300 ${
                        status === "completed" ? "bg-gradient-to-br from-[#4FFFEF] to-[#00d4aa] text-black shadow-lg shadow-[#4FFFEF]/30" :
                        status === "active" ? "bg-gradient-to-br from-[#A57CFF] to-[#7c3aed] text-white animate-pulse shadow-lg shadow-[#A57CFF]/30" :
                        "bg-white/5 text-white/50 border border-white/10"
                      }`}>
                        {status === "completed" ? <IconCheck /> : index + 1}
                      </div>
                      <span className={`text-sm font-medium transition-colors duration-300 ${
                        status === "completed" ? "text-[#4FFFEF]" :
                        status === "active" ? "text-white" :
                        "text-white/50"
                      }`}>
                        {step.label}
                        {status === "active" && <span className="inline-flex ml-1"><span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay: '0.1s'}}>.</span><span className="animate-bounce" style={{animationDelay: '0.2s'}}>.</span></span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <p className="text-center text-xs text-white/50">
              AI-powered analysis in progress
            </p>
          </div>
        )}

        {/* --- STATE: SUCCESS --- */}
        {scanState === "success" && result && (
          <div className="w-full max-w-2xl space-y-6 animate-fade-in-up">

            {/* Result Header */}
            <Card className="glass-card gap-0 p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    result.riskLevel === "CRITICAL" || result.riskLevel === "HIGH"
                      ? "bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-400 shadow-lg shadow-red-500/20"
                      : result.riskLevel === "MEDIUM"
                      ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 text-yellow-400 shadow-lg shadow-yellow-500/20"
                      : "bg-gradient-to-br from-green-500/20 to-green-600/10 text-green-400 shadow-lg shadow-green-500/20"
                  }`}>
                    <IconShield />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Scan Complete</h2>
                    <p className="text-sm text-white/60 font-mono break-all max-w-md">{displayInput}</p>
                    {inputType === "contract" && (
                      <p className="text-xs text-[#A57CFF] mt-1">{NETWORKS.find(n => n.id === network)?.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Score with animation */}
                  <div className="text-center">
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Safety Score</p>
                    <p className={`text-4xl font-bold tabular-nums ${
                      result.score >= 80 ? "text-green-400" :
                      result.score >= 50 ? "text-yellow-400" :
                      "text-red-400"
                    }`}>
                      {result.score}<span className="text-lg text-white/50">/100</span>
                    </p>
                  </div>

                  {/* Risk Level Badge with glow */}
                  <div className="text-center">
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Risk Level</p>
                    <Badge className={`text-sm font-bold px-4 py-1.5 rounded-lg ${
                      result.riskLevel === "CRITICAL" ? "risk-critical" :
                      result.riskLevel === "HIGH" ? "risk-high" :
                      result.riskLevel === "MEDIUM" ? "risk-medium" :
                      "risk-low"
                    } text-white`}>
                      {result.riskLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              {result.summary && (
                <p className="mt-5 pt-5 border-t border-white/5 text-sm text-white/60 leading-relaxed">
                  {result.summary}
                </p>
              )}
            </Card>

            {/* Findings */}
            <div>
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                Findings ({result.findings?.length || 0})
              </h3>

              {result.findings && result.findings.length > 0 ? (
                <div className="space-y-3">
                  {result.findings.map((finding, idx) => (
                    <Card key={idx} className={`gap-0 bg-[#0A0A0F] border p-4 ${getSeverityBorder(finding.severity || finding.type)}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityIcon(finding.severity || finding.type)}`}>
                          <IconAlertTriangle />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold uppercase ${
                              getSeverityColor(finding.severity || finding.type) === "red" ? "text-red-400" :
                              getSeverityColor(finding.severity || finding.type) === "yellow" ? "text-yellow-400" :
                              "text-blue-400"
                            }`}>
                              {finding.severity || finding.type}
                            </span>
                            {finding.type && finding.severity && (
                              <span className="text-xs text-white/60">• {finding.type}</span>
                            )}
                          </div>
                          <p className="text-sm text-white/80 break-words">{finding.message}</p>
                          {finding.file && (
                            <p className="text-xs text-[#A57CFF] mt-2 font-mono break-all">{finding.file}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="gap-0 bg-[#0A0A0F] border border-green-500/20 p-8 text-center">
                  <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <svg aria-hidden="true" className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">All Clear</h3>
                  <p className="text-white/60 text-sm max-w-sm mx-auto">
                    No security issues detected in this contract. The code appears to be safe.
                  </p>
                </Card>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                Scan Another Contract
              </Button>
            </div>
          </div>
        )}

        {/* --- STATE: ERROR --- */}
        {scanState === "error" && (
          <div role="alert" className="w-full max-w-md text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center text-red-400">
              <IconX />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">Scan Failed</h2>
              <p className="text-sm text-white/60 mb-4">We couldn&apos;t complete the security scan.</p>

              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <p className="text-sm text-red-400 font-mono break-words">{error}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleScan}
                className="w-full h-11 bg-gradient-to-r from-[#A57CFF] to-[#7c3aed] text-white"
              >
                Try Again
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                Try Different Contract
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={upgradeToPremium}
        scansUsed={scansUsed}
      />
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A57CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <WalletGate>
        <ScanPageContent />
      </WalletGate>
    </Suspense>
  );
}
