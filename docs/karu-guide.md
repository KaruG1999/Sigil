# Guía de Karu - VibeSafe

## Tu Rol
Estás a cargo del **Frontend** y la **experiencia de usuario**. Tu trabajo es hacer que VibeSafe se vea increíble y sea fácil de usar.

---

## Resumen de Tareas

| Prioridad | Tarea | Dificultad |
|-----------|-------|------------|
| 1 | Crear la app Next.js | Media |
| 2 | Implementar UI del scanner | Media |
| 3 | Mostrar resultados del análisis | Fácil |
| 4 | Integrar Wallet Connect | Media |
| 5 | Estilos y polish final | Fácil |

---

## Tarea 1: Crear la App Next.js

### Ubicación
```
apps/web/
```

### Pasos

1. **Inicializar Next.js 14** (desde la raíz del proyecto)
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
Debería correr en `http://localhost:3000`

---

## Tarea 2: Implementar UI del Scanner

### Crear la página principal

**Archivo:** `apps/web/src/app/page.tsx`

```tsx
"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState<"contract" | "code">("contract");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: inputType,
          input: input
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error scanning:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            =á VibeSafe
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
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-purple-500">
              <option value="ethereum">Ethereum Mainnet</option>
              <option value="polygon">Polygon</option>
              <option value="bsc">BSC</option>
              <option value="arbitrum">Arbitrum</option>
            </select>
          )}

          {/* Scan Button */}
          <button
            onClick={handleScan}
            disabled={loading || !input}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Analyzing..." : "= Analyze"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="max-w-2xl mx-auto mt-8">
            {/* Aquí va el componente de resultados - Tarea 3 */}
          </div>
        )}
      </div>
    </main>
  );
}
```

---

## Tarea 3: Mostrar Resultados del Análisis

### Crear componente de resultados

**Archivo:** `apps/web/src/components/ScanResult.tsx`

```tsx
interface Finding {
  type: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface ScanResultProps {
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  summary: string;
  findings: Finding[];
}

export function ScanResult({ riskLevel, summary, findings }: ScanResultProps) {
  const riskColors = {
    LOW: "bg-green-500",
    MEDIUM: "bg-yellow-500",
    HIGH: "bg-red-500",
  };

  const riskEmoji = {
    LOW: "",
    MEDIUM: " ",
    HIGH: "=¨",
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
      {/* Risk Badge */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl">{riskEmoji[riskLevel]}</span>
        <div>
          <span
            className={`${riskColors[riskLevel]} text-white px-3 py-1 rounded-full text-sm font-semibold`}
          >
            {riskLevel} RISK
          </span>
          <p className="text-gray-400 mt-2">{summary}</p>
        </div>
      </div>

      {/* Findings List */}
      {findings.length > 0 && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-semibold mb-4">Findings</h3>
          <div className="space-y-3">
            {findings.map((finding, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 border-l-4 border-red-500"
              >
                <p className="font-medium text-red-400">{finding.type}</p>
                <p className="text-gray-400 text-sm mt-1">{finding.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Usar el componente en page.tsx

Reemplaza el comentario `{/* Aquí va el componente de resultados */}` con:

```tsx
<ScanResult
  riskLevel={result.riskLevel}
  summary={result.summary}
  findings={result.findings}
/>
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
import { mainnet, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet, polygon],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
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

### Crear botón de Connect Wallet

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
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
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
import { Web3Provider } from "@/providers/Web3Provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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

- Loading spinner mientras analiza
- Fade in para los resultados
- Hover effects en los botones
- Gradientes en el header

---

## Checklist Final

- [ ] Next.js funcionando en `localhost:3000`
- [ ] UI del scanner con input de contract y code
- [ ] Selector de network
- [ ] Componente de resultados con findings
- [ ] Wallet Connect funcionando
- [ ] Estilos dark theme con purple accent
- [ ] Loading states
- [ ] Responsive design

---

## Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Lint
pnpm lint
```

---

## Preguntas?

Si tienes dudas, pregúntale a Anouk o usa Claude Code para ayudarte. No tengas miedo de experimentar con los estilos y hacerlo tuyo.

**Tip:** Enfócate primero en que funcione, luego en que se vea bonito.
