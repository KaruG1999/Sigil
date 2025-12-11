# 🔮 SIGIL — Arcane Node  

**Arcane Intelligence for Code Integrity**

SIGIL is an AI-powered, heuristic-driven code scanner designed to protect developers from malicious repositories, suspicious dependencies, and hidden security threats — especially targeting fake job offers and fraudulent bounties.

Inspired by arcane sigils and futuristic Web3 aesthetics, SIGIL provides a clear, actionable security report before you ever run the code.

<div align="center">
  <img src="./public/img/logo-sigil.png" height="120" />
  <br />
  <em>Trust the Sigil. Verify before you clone.</em>
</div>

---

## ✨ What is SIGIL?

SIGIL is a **developer security companion** that analyzes repositories using:

- 🧠 **AI-assisted pattern recognition**  
- ⚡ **Heuristic threat detection**  
- 🔒 **Dependency & script inspection**  
- 🪬 **SIGIL Score** — a clear risk assessment (LOW / MEDIUM / HIGH)  
- 📊 **Static analysis only** — no code execution for maximum safety

Built for developers who want **quick, meaningful insights** without deep security knowledge.

---

## 🚀 Features (MVP)

### 🔸 **Static Supply-Chain Security Checks**

Detects:
- Suspicious install/postinstall scripts (curl, wget, chmod +x, rm -rf)
- Dangerous or deprecated dependencies  
- High-entropy secrets (private keys, mnemonics, API tokens)  
- Wallet drainer patterns  
- Obfuscated or unusual JavaScript  
- Dangerous files (`.pem`, `.env`, `id_rsa`, `.ps1`, `.bat`, binaries)  
- Typosquatting in package names
- Hidden folders and unexpected artifacts  

### 🔸 **Human-Readable Risk Report**

- Risk level: **LOW / MEDIUM / HIGH**
- Detailed list of findings with severity
- File locations and context
- AI-generated summary explaining risks in plain language
- Recommended actions for developers

### 🔸 **Modern UI & Developer Experience**

- Elegant landing page with arcane-tech aesthetic
- Clean scanning flow with real-time feedback
- Error handling & validation
- Responsive design
- Demo repositories for testing

---

## 🧩 Architecture Overview (MVP)

```
Frontend (Next.js) → API (Express) → @sigil/core → Scan Results
```

### **Frontend**
- Repository URL input  
- `/scan` page with loading states  
- Results renderer with risk badges  
- Error handling  

### **API Gateway**
- Validates GitHub URLs  
- Calls `scanRepository()` from core  
- Returns structured JSON findings  
- Rate limiting and input sanitization

### **Core Engine (`@sigil/core`)**
- Reads repository files via GitHub API (no cloning)
- Applies heuristic rules:
  - Script analysis
  - Dependency checking
  - Secret detection
  - File pattern matching
  - Entropy analysis
- Computes risk score
- Returns consistent output format

**Important:** SIGIL MVP **does not execute any code** from analyzed repositories. All analysis is static and safe.

---

## 📦 Core Output Format

```json
{
  "repo": "https://github.com/example/repo",
  "riskLevel": "HIGH",
  "score": 85,
  "findings": [
    {
      "type": "script",
      "severity": "high",
      "message": "Suspicious postinstall script detected",
      "file": "package.json",
      "details": "Contains curl command downloading from external source"
    },
    {
      "type": "secret",
      "severity": "critical",
      "message": "Possible private key detected",
      "file": ".env",
      "details": "High entropy string matching private key pattern"
    }
  ],
  "summary": "This repository contains multiple high-risk indicators including suspicious installation scripts and potential leaked credentials. Review carefully before use."
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 • TailwindCSS • Shadcn/UI |
| Backend | Node.js • Express |
| Core Engine | TypeScript • Heuristics + AI |
| CLI | Node + Commander |
| Monorepo | PNPM + Turborepo |
| Analysis | Static file analysis • GitHub API |

---

## 📦 Installation

### Web Interface

```bash
pnpm install
pnpm dev
```

Access at: `http://localhost:3000`

### CLI Tool

SIGIL includes a powerful command-line interface for scanning repositories directly from your terminal.

**Installation:**

```bash
pnpm install -g sigil-cli
```

**Usage:**

```bash
# Scan a GitHub repository
sigil scan https://github.com/user/repo

# Scan a local directory
sigil scan ./my-project

# Get help
sigil --help
```

**CLI Features:**
- 🚀 Fast, lightweight scanning
- 📊 Formatted risk reports in terminal
- 🎨 Color-coded severity levels
- 📝 Detailed findings with file locations
- ⚡ Perfect for CI/CD integration

---

## 🧪 Testing with Demo Repositories

SIGIL includes demo repositories for testing:

1. **sigil-demo-clean** — Safe repository with no issues
2. **sigil-demo-suspicious** — Contains suspicious postinstall script
3. **sigil-demo-malicious** — Multiple high-risk indicators (leaked keys, obfuscation)

---

## 🧩 Project Structure

```
sigil/
│
├── apps/
│   ├── web/          → Next.js frontend
│   └── api/          → Express REST API
│
├── packages/
│   ├── core/         → Analysis engine + heuristics
│   └── cli/          → CLI tool
│
└── turbo.json        → Monorepo configuration
```

---

## 🗺️ Roadmap

### ✅ MVP (Current)
- Static analysis engine
- GitHub repository scanning
- Heuristic detection rules
- Risk scoring system
- Web interface
- **Functional CLI tool** (scan repos from terminal)

### 🔮 Future (SIGIL Pro)

**Phase 1: Enhanced Analysis**
- Sandbox execution environment (Docker/QEMU)
- Dynamic behavior monitoring
- Network traffic capture (pcap)
- Filesystem changes tracking
- Syscall analysis

**Phase 2: Advanced Security**
- SAST integration (Slither, Semgrep, Mythril)
- MISP threat intelligence
- MITRE ATT&CK mapping
- Vulnerability database correlation

**Phase 3: Web3 Integration**
- On-chain verification (SIGIL Seal)
- Smart contract auditing
- Wallet interaction analysis
- Blockchain attestation (ERC-721 / Stellar)

**Phase 4: Enterprise Features**
- Team collaboration
- CI/CD integration
- API for automated scanning
- Custom rule creation
- Advanced reporting

---

## 🛡️ Security Philosophy

SIGIL is designed with security-first principles:

- **No code execution** in MVP — zero risk of RCE
- **Read-only analysis** — no modifications to repositories
- **Input validation** — strict URL and size limits
- **Rate limiting** — protection against abuse
- **Privacy-focused** — no storage of analyzed code
- **Transparent** — open-source heuristics

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 🪬 License

MIT License — free to use, modify, and expand.

---

<div align="center">
  <sub>© 2025 SIGIL — Arcane Intelligence for Code Integrity</sub>
  <br />
  <em>Trust the Sigil. Verify before you clone.</em>
</div>