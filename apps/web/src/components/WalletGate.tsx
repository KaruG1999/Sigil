"use client";

import { useAccount } from "wagmi";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "./ConnectButton";
import { Card } from "../../components/ui/card";

interface WalletGateProps {
  children: React.ReactNode;
}

export function WalletGate({ children }: WalletGateProps) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen w-full overflow-hidden bg-[#0A0A0F] text-[#E8E8F5] relative">
        {/* Background Ambience */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#A57CFF]/10 rounded-full blur-[120px] opacity-30" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4FFFEF]/10 rounded-full blur-[120px] opacity-30" />
        </div>

        {/* Header */}
        <header className="relative z-50 w-full border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-lg">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="text-sm">Back to Home</span>
            </Link>

            <Link href="/" className="flex items-center gap-2">
              <div className="relative bg-[#0A0A0F] border border-white/10 p-1 rounded-lg">
                <Image src="/img/logo-sigil.png" alt="Logo" width={28} height={28} />
              </div>
              <span className="font-bold tracking-wider text-sm text-[#A57CFF]">SIGIL</span>
            </Link>

            <div className="w-24" />
          </div>
        </header>

        {/* Connect Wallet Screen */}
        <main className="relative z-10 min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
              {/* Lock Icon */}
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#A57CFF]/20 to-[#4FFFEF]/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#A57CFF]/20">
                <svg className="w-12 h-12 text-[#A57CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Connect Your Wallet
              </h1>

              <p className="text-[#E8E8F5]/50 max-w-sm mx-auto leading-relaxed">
                To use Sigil&apos;s security scanner, please connect your wallet first.
              </p>
            </div>

            <Card className="glass-card p-8 text-center space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>3 Free Scans</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI Analysis</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ConnectButton />
              </div>

              <p className="text-xs text-white/30">
                We support MetaMask, Trust Wallet, and other Web3 wallets
              </p>
            </Card>

            {/* Why connect */}
            <div className="bg-[#12121A]/50 border border-white/5 rounded-lg p-5">
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Why connect?</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 text-white/60">
                  <div className="w-5 h-5 rounded-full bg-[#A57CFF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-[#A57CFF]">1</span>
                  </div>
                  <span>Track your scan history and usage</span>
                </div>
                <div className="flex items-start gap-3 text-white/60">
                  <div className="w-5 h-5 rounded-full bg-[#A57CFF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-[#A57CFF]">2</span>
                  </div>
                  <span>Unlock premium features with on-chain payment</span>
                </div>
                <div className="flex items-start gap-3 text-white/60">
                  <div className="w-5 h-5 rounded-full bg-[#A57CFF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-[#A57CFF]">3</span>
                  </div>
                  <span>No personal data required - just your wallet</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
