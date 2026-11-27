import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConnectButton } from "@/components/ConnectButton";
import { Logo } from "@/components/Logo";
import { LandingMotion } from "@/components/LandingMotion";

const REPO_URL = "https://github.com/KaruG1999/Sigil";

// --- Icons (Heroicons outline, 1.5 stroke) ---
function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
    </svg>
  );
}

const ICONS = {
  warning:
    "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
  key: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z",
  lock: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
  code: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  arrows: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  user: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  cash: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  eye: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  arrowRight: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3",
};

const PROBLEMS = [
  {
    icon: ICONS.warning,
    title: "Rug pulls",
    desc: "Owners who can mint unlimited supply, drain liquidity or pause transfers whenever they want.",
  },
  {
    icon: ICONS.lock,
    title: "Honeypots",
    desc: "Tokens you can buy but never sell, thanks to hidden blacklists or transfer restrictions.",
  },
  {
    icon: ICONS.code,
    title: "Hidden backdoors",
    desc: "Obfuscated logic, upgradeable proxies and privileged functions buried deep in the code.",
  },
];

const STEPS = [
  { title: "Paste", desc: "Enter a contract address or paste Solidity source code." },
  { title: "Scan", desc: "Heuristics and AI review the code for known attack patterns." },
  { title: "Know", desc: "Get a safety score, risk level and a findings report." },
];

const FEATURES = [
  { icon: ICONS.cash, title: "Rug pull patterns", desc: "Unlimited mint, liquidity drains and owner-only withdrawals" },
  { icon: ICONS.lock, title: "Honeypot traps", desc: "Sell restrictions, blacklists and dynamic fees" },
  { icon: ICONS.arrows, title: "Reentrancy", desc: "External calls before state updates" },
  { icon: ICONS.user, title: "Access control", desc: "Missing modifiers and over-privileged roles" },
  { icon: ICONS.key, title: "Privileged functions", desc: "Pause, freeze and upgrade switches held by one key" },
  { icon: ICONS.eye, title: "Plain-language summary", desc: "An AI explanation of what the risks actually mean" },
];

const ctaPrimary =
  "bg-gradient-to-r from-[#A57CFF] to-[#7c3aed] text-white shadow-lg shadow-[#A57CFF]/20 hover:from-[#9361ff] hover:to-[#8b5cf6] hover:shadow-[#A57CFF]/40";

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: ReactNode; subtitle?: string }) {
  return (
    <div data-reveal className="mx-auto mb-14 max-w-2xl text-center">
      {eyebrow && (
        <Badge className="mb-4 border border-[#4FFFEF]/20 bg-[#4FFFEF]/10 text-[#4FFFEF]">{eyebrow}</Badge>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-pretty text-[#E8E8F5]/70">{subtitle}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <LandingMotion>
    <div className="min-h-screen w-full overflow-x-clip bg-[#0A0A0F] text-[#E8E8F5]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-[#A57CFF] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* --- HEADER --- */}
      <header
        data-nav
        className="fixed top-0 z-50 w-full border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 ease-out data-[scrolled]:border-white/5 data-[scrolled]:bg-[#0A0A0F]/75 data-[scrolled]:backdrop-blur-xl"
      >
        {/* Three columns: logo | links (truly centered) | actions */}
        <nav aria-label="Main" className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
          <Logo className="justify-self-start" />

          <div className="hidden items-center gap-8 text-sm font-medium text-[#E8E8F5]/70 md:flex">
            <a href="#how-it-works" className="nav-link rounded-sm transition-colors duration-150 hover:text-white">
              How it works
            </a>
            <a href="#features" className="nav-link rounded-sm transition-colors duration-150 hover:text-white">
              Features
            </a>
          </div>

          <div className="flex items-center justify-self-end gap-2 sm:gap-3">
            <ConnectButton variant="secondary" className="hidden sm:inline-flex" />
            <Button asChild className={`h-10 rounded-lg px-4 ${ctaPrimary} shadow-none hover:shadow-none`}>
              <Link href="/scan">Launch Scanner</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* --- HERO --- */}
        <section data-hero className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden pt-16">
          <div aria-hidden="true" data-hero-bg className="absolute inset-0 will-change-transform">
            <div data-hero-bg-img className="absolute inset-0">
              <Image
                src="/img/portada.webp"
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-center opacity-80"
                priority
              />
            </div>
            {/* Darken only where the text sits, so the artwork stays visible around it */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(10,10,15,0.82)_0%,rgba(10,10,15,0.55)_55%,rgba(10,10,15,0.15)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0A0A0F] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
          </div>

          {/* Cursor glow */}
          <div
            aria-hidden="true"
            data-hero-spot
            className="pointer-events-none absolute left-0 top-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(165,124,255,0.22)_0%,rgba(79,255,239,0.06)_40%,transparent_70%)] mix-blend-screen"
          />

          <div data-hero-content className="relative z-10 w-full max-w-6xl space-y-8 px-5 text-center sm:px-6">
            <div className="space-y-7">
              <Badge
                data-hero-item="badge"
                className="border border-[#A57CFF]/30 bg-[#A57CFF]/10 px-4 py-1.5 text-xs tracking-wide text-[#C4A8FF] backdrop-blur-sm"
              >
                <span aria-hidden="true" className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#4FFFEF] motion-safe:animate-pulse" />
                AI-powered smart contract scanner
              </Badge>

              {/* Each line fits whole on desktop (no orphan words); mobile balances the wrap */}
              <h1 className="text-[2.5rem] font-black leading-[1.02] tracking-[-0.035em] text-white md:text-[min(7.2vw,5.25rem)]">
                <span className="block overflow-hidden pb-[0.1em]">
                  <span data-hero-line className="inline-block text-balance md:whitespace-nowrap">
                    Know if a contract is safe
                  </span>
                </span>
                <span className="-mt-[0.1em] block overflow-hidden pb-[0.12em]">
                  <span data-hero-line className="text-shimmer inline-block bg-gradient-to-r from-[#A57CFF] via-[#4FFFEF] to-[#A57CFF] bg-clip-text text-transparent md:whitespace-nowrap">
                    before you sign.
                  </span>
                </span>
              </h1>

              <p
                data-hero-item="copy"
                className="mx-auto max-w-2xl text-pretty text-lg font-light leading-relaxed text-[#E8E8F5]/80 md:text-xl"
              >
                Scan any verified contract by address, or paste Solidity directly. Spot rug pulls, honeypots and
                hidden backdoors in seconds.
              </p>
            </div>

            <div data-hero-item="cta" className="pt-2">
              <Button asChild className={`btn-glow h-14 rounded-xl px-10 text-lg font-semibold ${ctaPrimary}`}>
                <Link href="/scan" className="group">
                  Start scanning
                  <Icon d={ICONS.arrowRight} className="h-5 w-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </Link>
              </Button>

              <p className="mt-4 text-center text-sm text-white/60">3 free scans · Just connect a wallet</p>
            </div>
          </div>

          <a
            href="#problem"
            data-hero-item="hint"
            className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col sm:inline-flex items-center gap-3 rounded-md text-white/60 transition-colors duration-150 hover:text-white"
          >
            <span className="text-xs tracking-widest">See how it works</span>
            {/* Scroll cue: a dot travelling down a short track */}
            <span aria-hidden="true" className="relative block h-9 w-[18px] rounded-full border border-white/25">
              <span className="scroll-cue absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/70" />
            </span>
          </a>
        </section>

        {/* --- PROBLEM --- */}
        <section id="problem" className="relative bg-[#0D0D12] px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              title={
                <>
                  Found a new token? <span className="text-[#F87171]">Now what?</span>
                </>
              }
              subtitle="Every day, people approve contracts they never read. These are the traps SIGIL looks for."
            />

            <div className="grid gap-6 md:grid-cols-3">
              {PROBLEMS.map((item) => (
                <div key={item.title} data-reveal className="h-full">
                  <article data-spotlight style={{ "--spot": "248 113 113" } as CSSProperties} className="spotlight-card group h-full rounded-xl border border-white/5 bg-[#15151E] p-7 transition-[translate] duration-300 ease-out hover:-translate-y-1">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                      <Icon d={item.icon} />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-[#E8E8F5]/70">{item.desc}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section id="how-it-works" className="relative overflow-hidden px-6 py-24">
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A57CFF]/5 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-5xl">
            <SectionHeading eyebrow="Simple process" title="Three steps to safer contracts" />

            <div data-steps className="relative">
              {/* Connector line between steps (desktop): track + the part that draws with scroll */}
              <div aria-hidden="true" className="absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-white/10 md:block" />
              <div aria-hidden="true" data-steps-line className="absolute left-[16.66%] right-[16.66%] top-8 hidden h-px origin-left bg-gradient-to-r from-[#A57CFF] via-[#4FFFEF] to-[#A57CFF] shadow-[0_0_12px_rgba(165,124,255,0.8)] md:block" />
              <ol className="relative grid gap-12 md:grid-cols-3">
                {STEPS.map((step, idx) => (
                  <li key={step.title} data-step className="text-center">
                    <div>
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#A57CFF] to-[#7c3aed] text-2xl font-bold text-white shadow-lg shadow-[#A57CFF]/20 ring-8 ring-[#0A0A0F]">
                        {idx + 1}
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>
                      <p className="mx-auto max-w-56 text-sm text-[#E8E8F5]/70">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-14 text-center">
              <Button asChild className={`h-12 rounded-lg px-8 font-semibold ${ctaPrimary}`}>
                <Link href="/scan">
                  Try it now
                  <Icon d={ICONS.arrowRight} className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- FEATURES --- */}
        <section id="features" className="relative bg-[#0B0B11] px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              title="What SIGIL detects"
              subtitle="Static heuristics catch the known patterns. AI explains what they mean for you."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature.title} data-reveal className="h-full">
                  <article data-spotlight className="spotlight-card group h-full rounded-xl border border-white/5 bg-[#12121A] p-6 transition-[translate] duration-300 ease-out hover:-translate-y-1">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#A57CFF]/10 text-[#A57CFF] transition-colors duration-200 group-hover:bg-[#A57CFF]/20">
                      <Icon d={feature.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1.5 text-lg font-bold text-white">{feature.title}</h3>
                    <p className="text-sm text-[#E8E8F5]/70">{feature.desc}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="px-6 py-24">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to scan your first contract?
            </h2>
            <p className="mb-8 text-[#E8E8F5]/70">
              Analyze smart contracts by address or paste your Solidity code directly.
            </p>

            <Button asChild className={`btn-glow h-14 rounded-xl px-10 text-lg font-semibold ${ctaPrimary}`}>
              <Link href="/scan">
                Launch Scanner
                <Icon d={ICONS.arrowRight} className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-white/5 bg-[#0A0A0F] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/60 md:flex-row">
          <div className="flex items-center gap-3">
            <Image src="/img/logo-mark.png" alt="" width={176} height={336} className="h-5 w-auto opacity-70" />
            <p>© 2025 SIGIL</p>
          </div>
          <p>Built for the Seedify Hackathon</p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm transition-colors duration-150 hover:text-white"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 007.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 015.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
            Source on GitHub
          </a>
        </div>
      </footer>
    </div>
    </LandingMotion>
  );
}
