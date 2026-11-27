import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIGIL — AI Smart Contract Security Scanner",
  description:
    "Scan smart contracts before you interact with them. AI-assisted detection of rug pulls, honeypots, reentrancy and access-control issues.",
  keywords: ["security", "web3", "ai", "smart contracts", "solidity", "scanner"],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "SIGIL — AI Smart Contract Security Scanner",
    description: "Know if a contract is safe before you interact with it.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Font variables live on <html> so Tailwind's base font-family can resolve them
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide animated elements until GSAP runs (see globals.css) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="antialiased">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
