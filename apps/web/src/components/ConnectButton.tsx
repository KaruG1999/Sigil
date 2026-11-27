"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { cn } from "@/lib/utils";

interface ConnectButtonProps {
  /** "primary" for the main call to action, "secondary" when another CTA sits next to it */
  variant?: "primary" | "secondary";
  className?: string;
}

const base =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-[background-color,border-color,color,scale] duration-150 ease-out enabled:active:scale-[0.96] disabled:opacity-60";

export function ConnectButton({ variant = "primary", className }: ConnectButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        title="Disconnect wallet"
        className={cn(
          base,
          "group border border-white/10 bg-[#12121A] text-white hover:border-white/20 hover:bg-[#1a1a24]",
          className
        )}
      >
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-400" />
        <span className="font-mono tabular-nums">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <span className="sr-only">Disconnect wallet</span>
      </button>
    );
  }

  const noWallet = !!error && /provider not found/i.test(error.message);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isPending}
        className={cn(
          base,
          variant === "primary"
            ? "bg-gradient-to-r from-[#A57CFF] to-[#7c3aed] text-white hover:from-[#9361ff] hover:to-[#8b5cf6]"
            : "border border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10",
          className
        )}
      >
        <WalletIcon />
        <span>{isPending ? "Connecting…" : "Connect Wallet"}</span>
      </button>

      {noWallet && (
        <p role="alert" className="absolute right-0 top-full mt-2 w-60 rounded-lg border border-white/10 bg-[#12121A] p-3 text-left text-xs text-white/70 shadow-xl">
          No browser wallet detected.{" "}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#A57CFF] underline underline-offset-2 hover:text-white"
          >
            Install MetaMask
          </a>{" "}
          or another Web3 wallet to continue.
        </p>
      )}
    </div>
  );
}

function WalletIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
      />
    </svg>
  );
}
