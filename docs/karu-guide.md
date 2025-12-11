# Guia de Karu - VibeSafe

## Tu Rol
Estas a cargo del **Frontend** y la **experiencia de usuario**. Tu trabajo es hacer que VibeSafe se vea increible y sea facil de usar.

---

## Resumen de Tareas

| Prioridad | Tarea | Dificultad |
|-----------|-------|------------|
| 1 | Crear la app Next.js | Media |
| 2 | Implementar UI del scanner | Media |
| 3 | Mostrar resultados del analisis | Media |
| 4 | Integrar Wallet Connect | Media |
| 5 | Estilos y polish final | Facil |

---

## API Reference (Importante!)

La API ya esta lista. Aqui esta la documentacion:

### Endpoint: POST /scan

**URL:** `http://localhost:4000/scan`

**Request:**
```json
{
  "type": "contract" | "code",
  "input": "0x... o codigo solidity",
  "network": "ethereum" // opcional, default: ethereum
}
```

**Response:**
```json
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": 0-100,
  "summary": "Descripcion del analisis",
  "findings": [
    {
      "type": "Nombre de la vulnerabilidad",
      "message": "Descripcion",
      "severity": "info" | "low" | "medium" | "high" | "critical",
      "location": "Ubicacion en el codigo (opcional)",
      "recommendation": "Como arreglarlo (opcional)"
    }
  ],
  "contractInfo": {
    "address": "0x...",
    "name": "ContractName",
    "compiler": "v0.8.0",
    "verified": true
  },
  "analyzedAt": "2024-12-10T...",
  "analysisType": "contract" | "code"
}
```

### Networks Soportadas

| ID | Nombre |
|----|--------|
| ethereum | Ethereum Mainnet |
| polygon | Polygon |
| bsc | BNB Smart Chain |
| arbitrum | Arbitrum One |
| optimism | Optimism |
| base | Base |

---

## Tarea 1: Crear la App Next.js

### Ubicacion
```
apps/web/
```

### Pasos

1. **Inicializar Next.js 14** (desde la raiz del proyecto)
```bash
cd apps
pnpm create next-app@latest web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

2. **Instalar dependencias UI**
```bash
cd web
pnpm add @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
```

3. **Configurar el package.json** para que se llame `@sigil/web`:
```json
{
  "name": "@sigil/web",
  "version": "1.0.0"
}
```

4. **Verificar que funciona**
```bash
pnpm dev
```
Deberia correr en `http://localhost:3000`

---

## Tarea 2: Implementar UI del Scanner

### Crear la pagina principal

**Archivo:** `apps/web/src/app/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { ScanResult } from "@/components/ScanResult";

interface ScanResponse {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riskScore: number;
  summary: string;
  findings: Array<{
    type: string;
    message: string;
    severity: "info" | "low" | "medium" | "high" | "critical";
    location?: string;
    recommendation?: string;
  }>;
  contractInfo?: {
    address: string;
    name?: string;
    compiler?: string;
    verified: boolean;
  };
  analyzedAt: string;
  analysisType: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState<"contract" | "code">("contract");
  const [network, setNetwork] = useState("ethereum");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:4000/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: inputType,
          input: input,
          network: inputType === "contract" ? network : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error scanning");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Failed to connect to API. Make sure it's running on port 4000.");
      console.error("Error scanning:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            VibeSafe
          </h1>
          <p className="text-gray-400 text-lg">
            AI-Powered Web3 Security Scanner
          </p>
        </div>

        {/* Scanner Card */}
        <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl p-8 border border-gray-800">
          {/* Input Type Selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setInputType("contract")}
              className={`px-4 py-2 rounded-lg transition ${
                inputType === "contract"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Contract Address
            </button>
            <button
              onClick={() => setInputType("code")}
              className={`px-4 py-2 rounded-lg transition ${
                inputType === "code"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Paste Code
            </button>
          </div>

          {/* Input Field */}
          {inputType === "contract" ? (
            <input
              type="text"
              placeholder="0x..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-purple-500"
            />
          ) : (
            <textarea
              placeholder="// Paste your Solidity code here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={10}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-purple-500 font-mono text-sm"
            />
          )}

          {/* Network Selector (solo para contract) */}
          {inputType === "contract" && (
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-purple-500"
            >
              <option value="ethereum">Ethereum Mainnet</option>
              <option value="polygon">Polygon</option>
              <option value="bsc">BNB Smart Chain</option>
              <option value="arbitrum">Arbitrum One</option>
              <option value="optimism">Optimism</option>
              <option value="base">Base</option>
            </select>
          )}

          {/* Scan Button */}
          <button
            onClick={handleScan}
            disabled={loading || !input}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="max-w-2xl mx-auto mt-8">
            <ScanResult result={result} />
          </div>
        )}
      </div>
    </main>
  );
}
```

---

## Tarea 3: Mostrar Resultados del Analisis

### Crear componente de resultados

**Archivo:** `apps/web/src/components/ScanResult.tsx`

```tsx
interface Finding {
  type: string;
  message: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  location?: string;
  recommendation?: string;
}

interface ContractInfo {
  address: string;
  name?: string;
  compiler?: string;
  verified: boolean;
}

interface ScanResultProps {
  result: {
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    riskScore: number;
    summary: string;
    findings: Finding[];
    contractInfo?: ContractInfo;
    analyzedAt: string;
  };
}

export function ScanResult({ result }: ScanResultProps) {
  const { riskLevel, riskScore, summary, findings, contractInfo } = result;

  const riskConfig = {
    LOW: { color: "bg-green-500", bgColor: "bg-green-500/10", textColor: "text-green-400", emoji: "✅" },
    MEDIUM: { color: "bg-yellow-500", bgColor: "bg-yellow-500/10", textColor: "text-yellow-400", emoji: "⚠️" },
    HIGH: { color: "bg-orange-500", bgColor: "bg-orange-500/10", textColor: "text-orange-400", emoji: "🔶" },
    CRITICAL: { color: "bg-red-500", bgColor: "bg-red-500/10", textColor: "text-red-400", emoji: "🚨" },
  };

  const severityColors = {
    info: "border-blue-500 bg-blue-500/10",
    low: "border-green-500 bg-green-500/10",
    medium: "border-yellow-500 bg-yellow-500/10",
    high: "border-orange-500 bg-orange-500/10",
    critical: "border-red-500 bg-red-500/10",
  };

  const config = riskConfig[riskLevel];

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
      {/* Risk Header */}
      <div className={`${config.bgColor} rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{config.emoji}</span>
            <div>
              <span className={`${config.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                {riskLevel} RISK
              </span>
              <p className="text-gray-300 mt-2">{summary}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{riskScore}</div>
            <div className="text-gray-400 text-sm">/100</div>
          </div>
        </div>
      </div>

      {/* Contract Info */}
      {contractInfo && contractInfo.verified && (
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Contract Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-white font-medium">{contractInfo.name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Compiler</p>
              <p className="text-white font-mono text-sm">{contractInfo.compiler || "Unknown"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Findings List */}
      {findings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Findings ({findings.length})
          </h3>
          <div className="space-y-3">
            {findings.map((finding, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 border-l-4 ${severityColors[finding.severity]}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-white">{finding.type}</p>
                    <p className="text-gray-400 text-sm mt-1">{finding.message}</p>
                    {finding.location && (
                      <p className="text-gray-500 text-xs mt-1 font-mono">
                        Location: {finding.location}
                      </p>
                    )}
                    {finding.recommendation && (
                      <p className="text-purple-400 text-sm mt-2">
                        💡 {finding.recommendation}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${severityColors[finding.severity]} capitalize`}>
                    {finding.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Findings */}
      {findings.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No vulnerabilities detected</p>
        </div>
      )}
    </div>
  );
}
```

---

## Tarea 4: Integrar Wallet Connect

### Instalar dependencias

```bash
pnpm add wagmi viem @tanstack/react-query
```

### Crear provider

**Archivo:** `apps/web/src/providers/Web3Provider.tsx`

```tsx
"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, polygon, bsc, arbitrum, optimism, base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet, polygon, bsc, arbitrum, optimism, base],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Crear boton de Connect Wallet

**Archivo:** `apps/web/src/components/ConnectButton.tsx`

```tsx
"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-mono"
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
    >
      Connect Wallet
    </button>
  );
}
```

### Envolver la app con el provider

**Archivo:** `apps/web/src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeSafe - Web3 Security Scanner",
  description: "AI-Powered security scanner for smart contracts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
```

---

## Tarea 5: Estilos y Polish

### Colores del tema (tailwind.config.ts)

```ts
// Agrega estos colores personalizados
colors: {
  vibe: {
    purple: "#8B5CF6",
    dark: "#0F0F1A",
    card: "#1A1A2E",
  }
}
```

### Animaciones sugeridas

- Loading spinner mientras analiza (ya incluido en el codigo)
- Fade in para los resultados
- Hover effects en los botones
- Gradientes en el header (ya incluido)

---

## Checklist Final

- [ ] Next.js funcionando en `localhost:3000`
- [ ] UI del scanner con input de contract y code
- [ ] Selector de network (6 networks)
- [ ] Componente de resultados con:
  - [ ] Risk level badge (LOW/MEDIUM/HIGH/CRITICAL)
  - [ ] Risk score (0-100)
  - [ ] Contract info
  - [ ] Findings con severity colors
  - [ ] Recommendations
- [ ] Wallet Connect funcionando
- [ ] Estilos dark theme con purple accent
- [ ] Loading states con spinner
- [ ] Error handling
- [ ] Responsive design

---

## Comandos Utiles

```bash
# Desarrollo (desde apps/web)
pnpm dev

# Build
pnpm build

# Lint
pnpm lint
```

---

## Probar la API

Antes de empezar, asegurate que la API este corriendo:

```bash
# Desde la raiz del proyecto
source .env && cd apps/api && pnpm ts-node src/index.ts
```

Prueba rapida:
```bash
curl http://localhost:4000/health
# Deberia responder: {"status":"ok","service":"vibesafe-api","version":"1.0.0"}
```

---

## Preguntas?

Si tienes dudas, preguntale a Anouk o usa Claude Code para ayudarte. No tengas miedo de experimentar con los estilos y hacerlo tuyo.

**Tip:** Enfocate primero en que funcione, luego en que se vea bonito.
