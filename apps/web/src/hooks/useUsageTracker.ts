"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "sigil_usage";
const FREE_SCANS = 3;

interface UsageData {
  [walletAddress: string]: {
    scansUsed: number;
    isPremium: boolean;
    lastScanAt?: string;
  };
}

interface UseUsageTrackerReturn {
  scansRemaining: number;
  scansUsed: number;
  isPremium: boolean;
  canScan: boolean;
  recordScan: () => void;
  upgradeToPremium: () => void;
  resetUsage: () => void;
}

export function useUsageTracker(walletAddress: string | undefined): UseUsageTrackerReturn {
  // Read persisted usage once, on first client render.
  // This hook only runs behind the wallet gate, which never renders on the server.
  const [usageData, setUsageData] = useState<UsageData>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as UsageData) : {};
    } catch (e) {
      console.error("Failed to load usage data:", e);
      return {};
    }
  });

  // Save usage data to localStorage
  const saveUsageData = useCallback((data: UsageData) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setUsageData(data);
      } catch (e) {
        console.error("Failed to save usage data:", e);
      }
    }
  }, []);

  // Get current user's usage
  const normalizedAddress = walletAddress?.toLowerCase();
  const userUsage = normalizedAddress ? usageData[normalizedAddress] : undefined;
  const scansUsed = userUsage?.scansUsed || 0;
  const isPremium = userUsage?.isPremium || false;

  // Calculate remaining scans
  const scansRemaining = isPremium ? Infinity : Math.max(0, FREE_SCANS - scansUsed);
  const canScan = isPremium || scansRemaining > 0;

  // Record a scan
  const recordScan = useCallback(() => {
    if (!normalizedAddress) return;

    const newData: UsageData = {
      ...usageData,
      [normalizedAddress]: {
        scansUsed: scansUsed + 1,
        isPremium,
        lastScanAt: new Date().toISOString(),
      },
    };
    saveUsageData(newData);
  }, [normalizedAddress, usageData, scansUsed, isPremium, saveUsageData]);

  // Upgrade to premium (mock)
  const upgradeToPremium = useCallback(() => {
    if (!normalizedAddress) return;

    const newData: UsageData = {
      ...usageData,
      [normalizedAddress]: {
        ...usageData[normalizedAddress],
        scansUsed,
        isPremium: true,
      },
    };
    saveUsageData(newData);
  }, [normalizedAddress, usageData, scansUsed, saveUsageData]);

  // Reset usage (for testing)
  const resetUsage = useCallback(() => {
    if (!normalizedAddress) return;

    const newData: UsageData = {
      ...usageData,
      [normalizedAddress]: {
        scansUsed: 0,
        isPremium: false,
      },
    };
    saveUsageData(newData);
  }, [normalizedAddress, usageData, saveUsageData]);

  return {
    scansRemaining,
    scansUsed,
    isPremium,
    canScan,
    recordScan,
    upgradeToPremium,
    resetUsage,
  };
}

export { FREE_SCANS };
