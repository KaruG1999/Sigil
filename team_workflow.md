# 👥 SIGIL — Team Workflow & Task Division

**8 Days Sprint Plan for Karen & Juan**

---

## 🎯 MVP Objective

Build **SIGIL Lite** — A static repository scanner that detects malicious patterns in GitHub repos without executing code, with a clean UI and demo-ready presentation.

**What we're NOT doing in this MVP:**
- ❌ Sandbox execution (Docker/QEMU)
- ❌ Dynamic code analysis
- ❌ Network traffic capture
- ❌ SAST tools integration (Slither, Mythril)
- ❌ MISP threat intelligence
- ❌ Complete MITRE ATT&CK mapping

**What we ARE doing:**
- ✅ Static file analysis
- ✅ Heuristic pattern detection
- ✅ Risk scoring system
- ✅ Clean web interface
- ✅ AI-powered summaries
- ✅ Demo repositories
- ✅ Professional documentation

---

## 👥 Team Roles

### 🎨 Karen — Frontend + Integration + Demo + Presentation
**Focus:** User experience, visual design, integration, and demo preparation

**Responsibilities:**
- Landing page design and implementation
- `/scan` page with results display
- UI components (loading states, error handling, risk badges)
- Frontend-API integration
- Demo repositories creation
- Pitch deck and video
- GitBook documentation design

### 🛡️ Juan — Backend + Core Scanner + Security
**Focus:** Analysis engine, heuristics, API, and security measures

**Responsibilities:**
- Core scanner implementation (`@sigil/core`)
- Heuristic rules and pattern detection
- Risk scoring algorithm
- API endpoints (Express)
- Security validation and protections
- Testing with malicious patterns
- Technical documentation

---

## 📅 8-Day Sprint Breakdown

### **Day 1-2: Foundation**

#### Karen's Tasks:
- [ ] Polish landing page UI
  - [ ] Hero section with SIGIL branding
  - [ ] Features overview
  - [ ] Call-to-action to scan page
- [ ] Improve `/scan` page structure
  - [ ] URL input with validation
  - [ ] Loading animation (arcane-themed)
  - [ ] Error state handling
- [ ] Create reusable UI components:
  - [ ] `RiskBadge` component (LOW/MEDIUM/HIGH)
  - [ ] `FindingCard` component
  - [ ] `LoadingSpinner` component
  - [ ] `ErrorAlert` component
- [ ] Set up API integration layer
  - [ ] Create API client (`lib/api.ts`)
  - [ ] Handle fetch errors
  - [ ] Type definitions for responses

#### Juan's Tasks:
- [ ] Implement core scanner foundation (`packages/core/src/scanner.ts`)
  - [ ] `scanRepository(repoUrl: string)` function
  - [ ] GitHub API integration (read-only)
  - [ ] Repository validation (size limits, URL format)
- [ ] Build initial heuristics:
  - [ ] Parse `package.json`
  - [ ] Detect suspicious scripts:
    - [ ] `postinstall` with curl/wget
    - [ ] `preinstall` with network calls
    - [ ] `install` with chmod/rm commands
  - [ ] Check for dangerous files:
    - [ ] `.env`, `.pem`, `id_rsa`
    - [ ] `.ps1`, `.bat` scripts
    - [ ] `wallet`, `mnemonic` patterns
- [ ] Create finding types and severity levels
- [ ] Initial risk scoring logic

---

### **Day 3-4: Core Features**

#### Karen's Tasks:
- [ ] Build results display UI
  - [ ] Risk level indicator (color-coded)
  - [ ] Findings list with expandable details
  - [ ] File path highlighting
  - [ ] Severity badges per finding
- [ ] Add animations and transitions
  - [ ] Scan progress animation
  - [ ] Results fade-in effect
  - [ ] Hover states for findings
- [ ] Implement responsive design
  - [ ] Mobile layout
  - [ ] Tablet optimization
- [ ] Create "Coming Soon" UI elements
  - [ ] "Mint SIGIL Seal" placeholder button
  - [ ] Web3 features teaser section

#### Juan's Tasks:
- [ ] Implement risk scoring algorithm
  - [ ] `computeRisk(findings)` function
  - [ ] Weight findings by severity
  - [ ] Calculate 0-100 score
  - [ ] Map to LOW/MEDIUM/HIGH
- [ ] Add advanced heuristics:
  - [ ] Dependency analysis (typosquatting detection)
  - [ ] Entropy scanner for secrets
    - [ ] Base64 strings
    - [ ] Hex patterns
    - [ ] High-entropy text
  - [ ] Obfuscation detection
  - [ ] Binary file detection in unexpected locations
- [ ] Build API endpoint
  - [ ] `POST /scan` in `apps/api/src/index.ts`
  - [ ] Input validation
  - [ ] Error handling
  - [ ] Response formatting

---

### **Day 5: Integration & Testing**

#### Karen's Tasks:
- [ ] Full frontend-backend integration
  - [ ] Connect scan page to API
  - [ ] Test all user flows
  - [ ] Handle edge cases
- [ ] Add AI summary section to UI
  - [ ] Display AI-generated explanation
  - [ ] "Why this is dangerous" section
  - [ ] "What to review" recommendations
- [ ] Create demo repositories:
  - [ ] `sigil-demo-clean` (safe repo)
  - [ ] `sigil-demo-suspicious` (medium risk)
  - [ ] `sigil-demo-malicious` (high risk)
- [ ] Add legal disclaimers
  - [ ] "Static analysis only"
  - [ ] "Not a guarantee of safety"
  - [ ] "Educational purposes"

#### Juan's Tasks:
- [ ] Backend testing with demo repos
  - [ ] Test against clean repository
  - [ ] Test against suspicious patterns
  - [ ] Test against malicious code
- [ ] Handle edge cases:
  - [ ] Private repositories (error handling)
  - [ ] Empty repositories
  - [ ] Repositories without package.json
  - [ ] Very large repositories (size limits)
  - [ ] Invalid URLs
- [ ] Implement rate limiting
- [ ] Add request validation middleware
- [ ] Security hardening:
  - [ ] Prevent path traversal
  - [ ] Sanitize inputs
  - [ ] Set timeouts

---

### **Day 6-7: Polish & Documentation**

#### Karen's Tasks:
- [ ] Final UI polish
  - [ ] Consistency check across pages
  - [ ] Typography refinement
  - [ ] Color scheme consistency
  - [ ] Icon usage
- [ ] Record demo video
  - [ ] Show scan flow
  - [ ] Demonstrate all risk levels
  - [ ] Highlight key features
- [ ] Prepare pitch deck
  - [ ] Problem statement
  - [ ] Solution (SIGIL)
  - [ ] Demo screenshots
  - [ ] Roadmap slide
  - [ ] Team slide
- [ ] GitBook content:
  - [ ] Home page
  - [ ] MVP features
  - [ ] Future roadmap (SIGIL Pro)
  - [ ] SIGIL Seal concept
  - [ ] Use cases

#### Juan's Tasks:
- [ ] Write technical documentation
  - [ ] API documentation
  - [ ] Heuristics explanation
  - [ ] Risk scoring methodology
  - [ ] Security measures
- [ ] Create architecture diagram
- [ ] Document future architecture (SIGIL Pro)
  - [ ] Sandbox execution plans
  - [ ] SAST integration
  - [ ] MISP threat intel
  - [ ] MITRE ATT&CK mapping
- [ ] Code cleanup and comments
- [ ] Add inline documentation
- [ ] Final security review

---

### **Day 8: Final Review & Submission**

#### Both Team Members:
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] Performance check
- [ ] Documentation review
- [ ] Pitch rehearsal
- [ ] Video editing final touches
- [ ] Submission preparation
- [ ] Backup all materials

---

## 🔄 GitHub Workflow

### Branch Strategy

**Permanent Branches:**
- `main` — Production-ready code only (for final demo)
- `dev` — Current development branch (daily merges)

**Feature Branches:**

**Juan's branches:**
- `feat/core-scanner`
- `feat/heuristics-engine`
- `feat/risk-scoring`
- `feat/api-endpoints`

**Karen's branches:**
- `feat/landing-page`
- `feat/scan-ui`
- `feat/results-display`
- `feat/demo-repos`

### Workflow Rules

1. **Never commit directly to `main` or `dev`**
2. **All changes via Pull Requests (PR)**
3. **Each PR must:**
   - Focus on one feature/fix
   - Include description of changes
   - Include screenshots (if UI)
   - Be reviewed by the other team member
   - Pass any basic checks
4. **PR naming:**
   - `feat: add risk badge component`
   - `fix: handle empty repository error`
   - `docs: update API documentation`

### Commit Message Format

```
type(scope): short description

Examples:
- feat(core): add entropy scanner for secrets
- fix(api): handle invalid GitHub URLs
- style(ui): improve loading animation
- docs(readme): update installation steps
- test(core): add heuristics test cases
```

### Daily Sync

**Every day at agreed time:**
1. Quick standup (5-10 min):
   - What I did yesterday
   - What I'm doing today
   - Any blockers
2. Merge latest `dev` into your feature branch
3. Resolve conflicts together if needed
4. Create PRs for completed features
5. Review each other's PRs

---

## 📋 Project Board Setup

### GitHub Projects — Kanban Board

**Columns:**
1. **📝 TODO** — Tasks not started
2. **🔄 IN PROGRESS** — Currently working on
3. **👀 REVIEW** — PR created, waiting for review
4. **✅ DONE** — Merged to dev

**Labels:**
- `frontend` — UI/UX work
- `backend` — API work
- `core` — Scanner engine
- `security` — Security-related
- `docs` — Documentation
- `bug` — Something broken
- `enhancement` — Improvement
- `demo` — Demo preparation
- `high-priority` — Must have for MVP

---

## 🚨 Critical Rules

### For Both:
1. **Never execute code from analyzed repositories**
2. **Always validate inputs before processing**
3. **Keep scope limited to MVP features**
4. **Document decisions and trade-offs**
5. **Test with demo repos frequently**

### For Karen:
1. Don't wait for perfect API — use mock data to develop UI
2. Create TypeScript types for API responses early
3. Keep components small and reusable
4. Test on different screen sizes
5. Save design decisions (colors, fonts, spacing)

### For Juan:
1. Prioritize safety over complexity
2. Log everything during scanning
3. Set strict limits (file size, processing time)
4. Never trust repository content
5. Document each heuristic rule clearly

---

## 🎯 Success Criteria

**By Day 8, we must have:**

✅ Working web application
- Landing page loads
- Scan page accepts GitHub URLs
- Results display correctly
- All states work (loading, error, success)

✅ Functional backend
- API responds to scan requests
- Core scanner analyzes repositories
- Risk scoring works
- Findings are accurate

✅ Demo ready
- 3 test repositories (clean, suspicious, malicious)
- Video demonstration recorded
- Pitch deck completed
- GitBook published

✅ Documentation
- README.md professional
- CONTRIBUTING.md clear
- Technical docs complete
- Architecture explained

---

## 💬 Communication

### Daily:
- Quick text updates on progress
- Blockers immediately communicated
- PR reviews within 4 hours

### Tools:
- GitHub Issues for task tracking
- GitHub PRs for code review
- GitHub Discussions for decisions
- Chat/Discord for quick questions

---

## 🎓 Learning Outcomes

**Karen will learn:**
- Complex state management in Next.js
- API integration patterns
- Security UI/UX best practices
- Demo and pitch preparation

**Juan will learn:**
- Static analysis techniques
- Heuristic rule design
- API security hardening
- Security documentation

---

## 🔮 Post-MVP Vision

This MVP is the foundation for **SIGIL Pro**, which will include:

- 🐳 Sandbox execution (Docker/QEMU)
- 📊 SAST integration (Slither, Semgrep, Mythril)
- 🌐 MISP threat intelligence
- 🗺️ Full MITRE ATT&CK mapping
- ⛓️ On-chain verification (SIGIL Seal)
- 🤝 Team collaboration features
- 🔌 CI/CD integration
- 📈 Advanced analytics

**Keep this vision in mind** while building, but stay focused on delivering a solid, working MVP first.

---

<div align="center">
  <strong>Trust the process. Trust the Sigil. 🔮</strong>
  <br />
  <em>Let's build something amazing together.</em>
</div>