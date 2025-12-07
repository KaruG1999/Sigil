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
app.get("/scan", async (req, res) => {
    try {
        const repo = req.query.repo;
        if (!repo) {
            return res.status(400).json({ error: "Missing ?repo=" });
        }
        const result = await (0, core_1.scanRepository)(repo);
        res.json(result);
    }
    catch (error) {
        console.error("Scan error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.listen(3002, () => {
    console.log("API listening on port 3002");
});
