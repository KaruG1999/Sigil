import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

interface AppHeaderProps {
  /** Controls rendered on the right side (wallet, usage badge, etc.) */
  actions?: ReactNode;
}

/** Header used inside the app (scanner + wallet gate). */
export function AppHeader({ actions }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-lg">
      <div className="mx-auto grid h-16 max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-md text-sm text-white/60 transition-colors duration-150 hover:text-white"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="hidden sm:inline">Back to home</span>
        </Link>

        <Logo />

        <div className="flex items-center justify-end gap-3">{actions}</div>
      </div>
    </header>
  );
}
