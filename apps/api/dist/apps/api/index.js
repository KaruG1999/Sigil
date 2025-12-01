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
app.post("/scan", async (req, res) => {
    const { repo } = req.body || {};
    if (!repo || typeof repo !== "string") {
        return res.status(400).json({ status: "error", message: "Missing 'repo' in request body" });
    }
    try {
        const { score, findings } = await (0, core_1.scanRepository)(repo);
        return res.json({ status: "success", score, findings });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ status: "error", message });
    }
});
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`SIGIL API running on http://localhost:${port}`);
});
