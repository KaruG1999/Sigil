"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const core_1 = require("@sigil/core");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize scanner with API keys from environment
const scanner = new core_1.VibeSafeScanner({
    etherscanApiKey: process.env.ETHERSCAN_API_KEY,
    claudeApiKey: process.env.ANTHROPIC_API_KEY,
});
// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "vibesafe-api",
        version: "1.0.0",
    });
});
// Get supported networks
app.get("/networks", (req, res) => {
    res.json({
        networks: [
            { id: "ethereum", name: "Ethereum Mainnet", chainId: 1 },
            { id: "polygon", name: "Polygon", chainId: 137 },
            { id: "bsc", name: "BNB Smart Chain", chainId: 56 },
            { id: "arbitrum", name: "Arbitrum One", chainId: 42161 },
            { id: "optimism", name: "Optimism", chainId: 10 },
            { id: "base", name: "Base", chainId: 8453 },
        ],
    });
});
// Main scan endpoint
app.post("/scan", async (req, res) => {
    try {
        const { type, input, network } = req.body;
        // Validate required fields
        if (!type || !input) {
            return res.status(400).json({
                error: "Missing required fields",
                message: "Both 'type' and 'input' are required",
                example: {
                    type: "contract | code",
                    input: "0x... or solidity code",
                    network: "ethereum (optional)",
                },
            });
        }
        // Validate type
        if (!["contract", "code"].includes(type)) {
            return res.status(400).json({
                error: "Invalid type",
                message: "Type must be 'contract' or 'code'",
            });
        }
        const scanInput = {
            type,
            input,
            network: network || "ethereum",
        };
        console.log(`Scanning ${type}: ${type === "contract" ? input : "[code]"}`);
        const result = await scanner.scan(scanInput);
        console.log(`Scan complete. Risk: ${result.riskLevel} (${result.riskScore}/100)`);
        return res.json(result);
    }
    catch (err) {
        console.error("Scan error:", err);
        return res.status(500).json({
            error: "Internal server error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════╗
  ║     VibeSafe API v1.0.0                  ║
  ║     Running on http://localhost:${PORT}      ║
  ╚══════════════════════════════════════════╝
  `);
});
