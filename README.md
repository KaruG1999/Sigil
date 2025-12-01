# 🔮 SIGIL — Arcane Node  

**Arcane Intelligence for Code Integrity**

SIGIL is an AI-powered, heuristic-driven code scanner designed to protect developers from malicious repositories, suspicious dependencies, and hidden security threats.  

Inspired by arcane sigils and futuristic Web3 aesthetics, SIGIL provides a clear, actionable security report before you ever run the code.

<div align="center">
  <img src="./apps/web/public/img/logo-sigil.png" height="120" />
  <br />
  <em>Trust the Sigil. Verify before you clone.</em>
</div>

---

## ✨ What is SIGIL?

SIGIL is a **developer security companion** that analyzes repositories using:

- 🧠 **AI-assisted pattern recognition**  
- ⚡ **Heuristic threat detection**  
- 🔒 **Dependency & script inspection**  
- 🪬 **SIGIL Score** — a clear risk assessment  
- 🔗 *(Coming soon)* **On-chain verification & attestation**

It's built for developers who want **quick, meaningful insights** without deep security knowledge.

---

## 🚀 Features

- **Paste any repo link** → get an instant security scan  
- **CLI tool `sigil scan <path>`):** scan local repos  
- **Detection of:**
  - Suspicious install scripts  
  - Obfuscated or injected code  
  - Unexpected network calls  
  - Malicious `node_modules` patterns  
  - Hidden binaries or executables  
- **Clean UI with arcane-tech aesthetics**

---

## 🛠️ Tech Stack

SIGIL is built as a modern monorepo:

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 • TailwindCSS • Shadcn/UI |
| Backend | Node.js • Express (temporary MVP API) |
| Core Engine | TypeScript • Heuristics + AI LLMs |
| CLI | Node + Commander |
| Monorepo | PNPM + Turborepo |

---

## 📦 Installation (CLI)

```bash
pnpm install -g sigil-cli
```

Then run:

```bash
sigil scan ./my-repository
```

---

## 🌐 Web Scanner

Available at:

```bash
http://localhost:3000/scan
```

Paste any public repository URL and let the arcane node analyze it.

---

## 🧩 Project Structure

```
sigil/
│
├── apps/
│   ├── web/      → Next.js frontend
│   └── api/      → REST scan endpoint (MVP)
│
├── packages/
│   ├── core/     → Analysis engine + heuristics + AI
│   ├── cli/      → SIGIL CLI tool
│   
│
└── turbo.json
```

---

## 🧪 Development

```bash
pnpm install
pnpm dev
```

- Frontend: http://localhost:3000
- API: http://localhost:4000/scan

---

## 🤝 Contributing

Contributions are welcome!

Please read CONTRIBUTING.md before submitting a PR.

---

## 🪬 License

MIT License — free to use, modify, and expand.

---

<div align="center">
  <sub>© 2025 SIGIL — Arcane Intelligence for Code Integrity</sub>
</div>