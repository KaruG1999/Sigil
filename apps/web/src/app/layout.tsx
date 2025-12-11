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
  title: "SIGIL - Arcane Node | Web3 AI Security",
  description: "Arcane Intelligence for Code Integrity. AI-driven repository analysis, heuristic threat detection, and on-chain sigil seal verification.",
  keywords: ["security", "web3", "ai", "code analysis", "blockchain", "arcane"],
  authors: [{ name: "SIGIL Team" }],
  openGraph: {
    title: "SIGIL - Arcane Node",
    description: "Arcane Intelligence for Code Integrity",
    type: "website",
    url: "https://sigil.app",
  },
};

// 👇 ESTE BLOQUE ES *OBLIGATORIO*
export const generateViewport = (): Viewport => ({
  width: "device-width",
  initialScale: 1,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}

