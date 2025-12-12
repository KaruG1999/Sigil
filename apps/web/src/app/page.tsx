"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ConnectButton } from "@/components/ConnectButton";

// Icons as components for professional look
const IconShield = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const IconKey = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

const IconCode = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const IconWarning = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const IconPackage = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const IconTerminal = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const IconFolder = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
);

const IconGlobe = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const router = useRouter();

  const handleScan = () => {
    if (repoUrl.trim()) {
      // Encode the URL and pass it to scan page
      router.push(`/scan?repo=${encodeURIComponent(repoUrl.trim())}`);
    } else {
      router.push("/scan");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0A0A0F] text-[#E8E8F5]">

      {/* --- HEADER --- */}
      <header className="fixed top-0 z-50 w-full bg-[#0A0A0F]/80 backdrop-blur-lg border-b border-[#A57CFF]/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#A57CFF] rounded-md blur-md opacity-0 group-hover:opacity-60 transition duration-300" />
              <div className="relative bg-[#0A0A0F] rounded-md p-1 border border-white/10">
                <Image
                  src="/img/logo-sigil.png"
                  alt="SIGIL Logo"
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />
              </div>
            </div>
            <span className="font-bold text-lg tracking-wider text-white group-hover:text-[#A57CFF] transition-colors">SIGIL</span>
          </Link>

          <div className="hidden md:flex gap-8 text-sm font-medium text-[#E8E8F5]/60">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>

          <div className="flex items-center gap-3">
            <ConnectButton />
            <Link href="/scan">
              <Button size="sm" className="bg-[#A57CFF] text-white hover:bg-[#9366E8] transition-all">
                Launch Scanner
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen pt-20 flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/img/portada.png"
            alt="SIGIL Background"
            fill
            className="object-cover object-center opacity-40"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/50 via-[#0A0A0F]/80 to-[#0A0A0F]" />
        </div>

        <div className="relative z-10 max-w-4xl text-center space-y-8 px-6">
          <div className="space-y-6">
            <Badge className="bg-[#A57CFF]/10 text-[#A57CFF] border border-[#A57CFF]/30 px-4 py-1.5 text-xs tracking-widest uppercase">
              AI-Powered Security Scanner
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Know if code is safe
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A57CFF] to-[#4FFFEF]">
                before you run it.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#E8E8F5]/70 font-light leading-relaxed max-w-2xl mx-auto">
              Analyze any GitHub repository in seconds.
              Detect malware, exposed secrets, and suspicious patterns.
            </p>
          </div>

          {/* Scan Input in Hero */}
          <div className="max-w-xl mx-auto w-full pt-4">
            <div className="relative">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                placeholder="https://github.com/username/repository"
                className="w-full h-14 pl-5 pr-36 bg-[#12121A] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#A57CFF] focus:ring-1 focus:ring-[#A57CFF] transition-all font-mono text-sm"
              />
              <Button
                onClick={handleScan}
                className="absolute right-2 top-2 h-10 px-5 bg-gradient-to-r from-[#A57CFF] to-[#7c3aed] hover:from-[#9361ff] hover:to-[#8b5cf6] text-white font-semibold rounded-lg transition-all"
              >
                Scan
                <IconArrowRight />
              </Button>
            </div>

            <p className="text-center text-sm text-white/40 mt-4">
              Free. No signup required.
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="pt-12">
            <a href="#how-it-works" className="inline-flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors">
              <span className="text-xs uppercase tracking-widest">See how it works</span>
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF BAR --- */}
      <section className="py-8 px-6 border-y border-white/5 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 text-center">
          <p className="text-sm text-white/40">Trusted by developers from</p>
          <div className="flex items-center gap-8 text-white/30">
            <span className="font-semibold">GitHub</span>
            <span className="font-semibold">Vercel</span>
            <span className="font-semibold">Seedify</span>
          </div>
        </div>
      </section>

      {/* --- PROBLEM SECTION --- */}
      <section className="relative py-24 px-6 bg-[#0D0D12]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              You've cloned a repo. <span className="text-[#EF4444]">Now what?</span>
            </h2>
            <p className="text-[#E8E8F5]/50 max-w-2xl mx-auto">
              Every day, developers unknowingly run malicious code. Don't be one of them.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-[#15151E] border-white/5 p-8 hover:border-red-500/30 transition-colors group">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform">
                <IconWarning />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fake Technical Tests</h3>
              <p className="text-[#E8E8F5]/50 text-sm leading-relaxed">
                Job offers that look legitimate but contain hidden malware targeting developers.
              </p>
            </Card>

            <Card className="bg-[#15151E] border-white/5 p-8 hover:border-red-500/30 transition-colors group">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform">
                <IconKey />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Exposed Secrets</h3>
              <p className="text-[#E8E8F5]/50 text-sm leading-relaxed">
                API keys, private wallets, and credentials accidentally committed to public repos.
              </p>
            </Card>

            <Card className="bg-[#15151E] border-white/5 p-8 hover:border-red-500/30 transition-colors group">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform">
                <IconTerminal />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Malicious Scripts</h3>
              <p className="text-[#E8E8F5]/50 text-sm leading-relaxed">
                postinstall hooks that silently exfiltrate your data or compromise your system.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#A57CFF]/5 blur-[100px] rounded-full" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-[#4FFFEF]/10 text-[#4FFFEF] border border-[#4FFFEF]/20 mb-4">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Three steps to safer code
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A57CFF] to-[#7c3aed] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-[#A57CFF]/20">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Paste</h3>
              <p className="text-[#E8E8F5]/50 text-sm">
                Enter any public GitHub repository URL
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A57CFF] to-[#7c3aed] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-[#A57CFF]/20">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Scan</h3>
              <p className="text-[#E8E8F5]/50 text-sm">
                AI analyzes every file, dependency, and script
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A57CFF] to-[#7c3aed] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg shadow-[#A57CFF]/20">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Know</h3>
              <p className="text-[#E8E8F5]/50 text-sm">
                Get a risk score and detailed findings report
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/scan">
              <Button className="h-12 px-8 bg-gradient-to-r from-[#A57CFF] to-[#7c3aed] hover:from-[#9361ff] hover:to-[#8b5cf6] text-white font-semibold rounded-lg transition-all">
                Try it now
                <IconArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="relative py-24 px-6 bg-[#0B0B11]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What SIGIL detects
            </h2>
            <p className="text-[#E8E8F5]/50">
              Comprehensive security analysis powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <IconKey />, title: "Exposed Secrets", desc: "API keys, private keys, tokens, and credentials" },
              { icon: <IconPackage />, title: "Suspicious Dependencies", desc: "Known malicious packages and typosquatting" },
              { icon: <IconTerminal />, title: "Dangerous Scripts", desc: "postinstall, preinstall, and lifecycle hooks" },
              { icon: <IconCode />, title: "Obfuscation Patterns", desc: "eval(), base64 encoding, hex strings" },
              { icon: <IconFolder />, title: "Hidden Files", desc: "Suspicious dotfiles and directories" },
              { icon: <IconGlobe />, title: "External URLs", desc: "Data exfiltration endpoints and suspicious links" },
            ].map((feature, idx) => (
              <Card key={idx} className="bg-[#12121A] border border-white/5 p-6 hover:border-[#A57CFF]/30 transition-all duration-300 group">
                <div className="w-10 h-10 bg-[#A57CFF]/10 rounded-lg flex items-center justify-center text-[#A57CFF] mb-4 group-hover:bg-[#A57CFF]/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-[#E8E8F5]/50 text-sm">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to scan your first repo?
          </h2>

          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                placeholder="https://github.com/username/repository"
                className="w-full h-14 pl-5 pr-36 bg-[#12121A] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#A57CFF] focus:ring-1 focus:ring-[#A57CFF] transition-all font-mono text-sm"
              />
              <Button
                onClick={handleScan}
                className="absolute right-2 top-2 h-10 px-5 bg-gradient-to-r from-[#A57CFF] to-[#7c3aed] hover:from-[#9361ff] hover:to-[#8b5cf6] text-white font-semibold rounded-lg transition-all"
              >
                Scan
                <IconArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative w-full py-8 px-6 border-t border-white/5 bg-[#0A0A0F]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image src="/img/logo-sigil.png" alt="Logo" width={20} height={20} className="opacity-50" />
            <p className="text-white/40 text-sm">
              © 2025 SIGIL Protocol
            </p>
          </div>
          <p className="text-white/30 text-sm">
            Built for Seedify Hackathon
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
