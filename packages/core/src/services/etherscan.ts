import axios from "axios";
import { NETWORKS } from "../config/networks";
import type { NetworkType, ContractInfo } from "../types";

export class EtherscanService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ETHERSCAN_API_KEY || "";
  }

  async getContractSource(
    address: string,
    network: NetworkType = "ethereum"
  ): Promise<ContractInfo> {
    const config = NETWORKS[network];

    // Etherscan V2 API format with chainid parameter
    const url = `${config.explorerApi}?chainid=${config.chainId}&module=contract&action=getsourcecode&address=${address}&apikey=${this.apiKey}`;

    try {
      const response = await axios.get(url);

      // Check for API errors
      if (response.data.status === "0") {
        throw new Error(response.data.message || response.data.result || "Etherscan API error");
      }

      // Check if result exists and is an array
      if (!response.data.result || !Array.isArray(response.data.result) || response.data.result.length === 0) {
        return {
          address,
          verified: false,
        };
      }

      const result = response.data.result[0];

      // Check if contract is verified
      if (!result || !result.SourceCode || result.SourceCode === "") {
        return {
          address,
          verified: false,
        };
      }

      // Handle verified contracts
      let sourceCode = result.SourceCode;

      // Some contracts have JSON wrapped source (multi-file contracts)
      if (typeof sourceCode === "string" && sourceCode.startsWith("{{")) {
        try {
          const parsed = JSON.parse(sourceCode.slice(1, -1));
          sourceCode = Object.values(parsed.sources)
            .map((s: any) => s.content)
            .join("\n\n");
        } catch {
          // Keep original if parsing fails
        }
      } else if (typeof sourceCode === "string" && sourceCode.startsWith("{")) {
        // Single JSON object format
        try {
          const parsed = JSON.parse(sourceCode);
          if (parsed.sources) {
            sourceCode = Object.values(parsed.sources)
              .map((s: any) => s.content)
              .join("\n\n");
          }
        } catch {
          // Keep original if parsing fails
        }
      }

      // Parse ABI safely
      let abi: any[] = [];
      try {
        if (result.ABI && result.ABI !== "Contract source code not verified") {
          abi = JSON.parse(result.ABI);
        }
      } catch {
        abi = [];
      }

      return {
        address,
        name: result.ContractName || "Unknown",
        compiler: result.CompilerVersion || "Unknown",
        verified: true,
        sourceCode,
        abi,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Etherscan API request failed: ${error.message}`);
      }
      throw new Error(`Failed to fetch contract: ${error}`);
    }
  }

  async isContractVerified(
    address: string,
    network: NetworkType = "ethereum"
  ): Promise<boolean> {
    const info = await this.getContractSource(address, network);
    return info.verified;
  }
}
