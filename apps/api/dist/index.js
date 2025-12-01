"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const src_1 = require("../../packages/core/src");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/scan", (req, res) => {
    const { repo } = req.body;
    const result = (0, src_1.scanRepo)(repo);
    res.json(result);
});
app.listen(4000, () => {
    console.log("SIGIL API running on http://localhost:4000");
});
