// Minimal utility used by UI components in the web app.
// Keep implementation tiny and dependency-free for MVP.
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default cn;
