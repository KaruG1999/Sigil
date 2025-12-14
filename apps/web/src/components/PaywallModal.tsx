"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FREE_SCANS } from "../hooks/useUsageTracker";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  scansUsed: number;
}

export function PaywallModal({ isOpen, onClose, onUpgrade, scansUsed }: PaywallModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"plans" | "processing" | "success">("plans");

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    setStep("processing");

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setStep("success");
    setIsProcessing(false);

    // Call the upgrade callback after showing success
    setTimeout(() => {
      onUpgrade();
      onClose();
      setStep("plans");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={step === "plans" ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-fade-in-up">
        <Card className="glass-card p-0 overflow-hidden">
          {/* Header */}
          <div className="relative p-6 pb-0">
            {step === "plans" && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            <div className="text-center">
              {step === "plans" && (
                <>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#A57CFF]/20 to-[#4FFFEF]/20 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[#A57CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Premium</h2>
                  <p className="text-white/50 text-sm">
                    You&apos;ve used all {FREE_SCANS} free scans. Upgrade for unlimited access.
                  </p>
                </>
              )}

              {step === "processing" && (
                <>
                  <div className="w-16 h-16 mx-auto relative mb-4">
                    <div className="absolute inset-0 border-2 border-[#A57CFF]/20 rounded-full" />
                    <div className="absolute inset-0 border-2 border-transparent border-t-[#A57CFF] rounded-full animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
                  <p className="text-white/50 text-sm">
                    Please wait while we confirm your transaction...
                  </p>
                </>
              )}

              {step === "success" && (
                <>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome to Premium!</h2>
                  <p className="text-white/50 text-sm">
                    You now have unlimited access to Sigil&apos;s security scanner.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "plans" && (
              <div className="space-y-4">
                {/* Usage Stats */}
                <div className="bg-[#0A0A0F] rounded-lg p-4 flex items-center justify-between">
                  <span className="text-white/60 text-sm">Scans used</span>
                  <span className="text-white font-mono">
                    {scansUsed} / {FREE_SCANS}
                  </span>
                </div>

                {/* Premium Plan */}
                <div className="bg-gradient-to-br from-[#A57CFF]/10 to-[#4FFFEF]/5 border border-[#A57CFF]/20 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Premium Plan</h3>
                      <p className="text-white/50 text-sm">Unlimited scans forever</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">0.01 BNB</div>
                      <div className="text-xs text-white/40">one-time payment</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <svg className="w-4 h-4 text-[#4FFFEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Unlimited contract scans</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <svg className="w-4 h-4 text-[#4FFFEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>AI-powered deep analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <svg className="w-4 h-4 text-[#4FFFEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <svg className="w-4 h-4 text-[#4FFFEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Lifetime access</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#A57CFF] to-[#7c3aed] hover:from-[#9361ff] hover:to-[#8b5cf6] text-white border-0"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Upgrade Now
                  </Button>
                </div>

                {/* Demo Notice */}
                <p className="text-center text-xs text-white/30">
                  Demo mode: No actual payment will be processed
                </p>
              </div>
            )}

            {step === "processing" && (
              <div className="py-8">
                <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                  <div className="w-2 h-2 bg-[#A57CFF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-[#A57CFF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-[#A57CFF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="py-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                  <p className="text-green-400 text-sm">
                    Transaction confirmed! Redirecting...
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
