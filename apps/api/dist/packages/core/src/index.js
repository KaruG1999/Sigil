"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRepository = scanRepository;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function scanRepository(target) {
    const findings = [];
    try {
        // Basic heuristic: if target is a URL, try to fetch package.json from GitHub raw
        let pkg = null;
        if (/^https?:\/\//.test(target)) {
            // Try to resolve common GitHub raw URL for package.json using global fetch
            try {
                const rawUrl = (() => {
                    const m = target.match(/github.com\/(.+?)\/(.+?)(?:\/|$)/);
                    if (m)
                        return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/main/package.json`;
                    return null;
                })();
                if (rawUrl) {
                    const resp = await fetch(rawUrl, { method: "GET" });
                    if (resp.ok) {
                        pkg = await resp.json();
                    }
                }
            }
            catch (e) {
                // ignore fetch errors; we'll simulate
            }
        }
        else {
            // Treat as filesystem path
            try {
                const stat = await promises_1.default.stat(target);
                if (stat.isDirectory()) {
                    const pkgPath = path_1.default.join(target, "package.json");
                    try {
                        const content = await promises_1.default.readFile(pkgPath, "utf8");
                        pkg = JSON.parse(content);
                    }
                    catch (e) {
                        // no package.json or parse error
                    }
                }
            }
            catch (e) {
                // path does not exist
                findings.push({ type: "warning", msg: `Target path not found: ${target}` });
                return { score: 0, findings };
            }
        }
        // Heuristic checks
        if (pkg && pkg.scripts) {
            const scripts = Object.keys(pkg.scripts || {});
            if (scripts.includes("postinstall") || scripts.includes("install")) {
                findings.push({ type: "warning", msg: "Suspicious install/postinstall script in package.json" });
            }
        }
        else {
            findings.push({ type: "info", msg: "No package.json found or empty repository" });
        }
        // Check for obfuscated/minified files (simple heuristic)
        try {
            if (!/^https?:\/\//.test(target)) {
                const files = await promises_1.default.readdir(target);
                const suspicious = files.filter((f) => f.endsWith(".min.js") || f.endsWith(".bundle.js"));
                if (suspicious.length > 0) {
                    findings.push({ type: "warning", msg: `Found minified/bundle files: ${suspicious.join(", ")}` });
                }
                else {
                    findings.push({ type: "info", msg: "No obfuscated files detected" });
                }
            }
        }
        catch (e) {
            // ignore
        }
        // Simple scoring: start at 90, subtract 20 per warning, 40 per critical, floor at 0
        let score = 90;
        for (const f of findings) {
            if (f.type === "warning")
                score -= 20;
            if (f.type === "critical")
                score -= 40;
        }
        score = Math.max(0, score);
        return { score, findings };
    }
    catch (err) {
        return { score: 0, findings: [{ type: "critical", msg: err.message || String(err) }] };
    }
}
exports.default = scanRepository;
