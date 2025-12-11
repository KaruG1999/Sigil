import type { NetworkType, NetworkConfig } from "../types";

// Etherscan V2 API uses a unified endpoint with chainid parameter
export const ETHERSCAN_V2_API = "https://api.etherscan.io/v2/api";

export const NETWORKS: Record<NetworkType, NetworkConfig> = {
  ethereum: {
    chainId: 1,
    name: "Ethereum Mainnet",
    explorerApi: ETHERSCAN_V2_API,
  },
  polygon: {
    chainId: 137,
    name: "Polygon",
    explorerApi: ETHERSCAN_V2_API,
  },
  bsc: {
    chainId: 56,
    name: "BNB Smart Chain",
    explorerApi: ETHERSCAN_V2_API,
  },
  arbitrum: {
    chainId: 42161,
    name: "Arbitrum One",
    explorerApi: ETHERSCAN_V2_API,
  },
  optimism: {
    chainId: 10,
    name: "Optimism",
    explorerApi: ETHERSCAN_V2_API,
  },
  base: {
    chainId: 8453,
    name: "Base",
    explorerApi: ETHERSCAN_V2_API,
  },
};
