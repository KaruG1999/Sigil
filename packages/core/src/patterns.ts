// patterns.ts
// Collections of heuristics/patterns used by scanRepository

export const suspiciousFilenames = [
  "install.sh",
  "postinstall.sh",
  "wallet.js",
  "steal.js",
  "background.js",
  "inject.js",
  "payload.js",
  "miner.js",
  "drain.js",
  "keylogger.js",
  "dropper.js",
];

export const suspiciousScripts = ["postinstall", "preinstall", "prepare", "install"];

// simple secret regexes (examples)
export const secretPatterns: RegExp[] = [
  // AWS Access Key ID
  /AKIA[0-9A-Z]{16}/g,
  // AWS Secret Access Key (base64-like)
  /(?<![A-Za-z0-9\-])[A-Za-z0-9\/+=]{40,100}(?![A-Za-z0-9\/+=])/g,
  // Private key blocks
  /-----BEGIN (RSA|EC|DSA)? ?PRIVATE KEY-----/g,
  // Slack tokens
  /xox[baprs]-[0-9a-zA-Z]{10,}/g,
  // JWT-looking strings
  /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
];

export const badDependencies = [
  // example known-malicious or risky packages (user will edit later)
  "electron-zip-malware",
  "some-malicious-lib",
  "obfuscator-js",
];

export const urlIndicators = ["pastebin.com", "raw.githubusercontent.com", "iplogger", "grabify", "bit.ly"];

export const obfuscationIndicators: RegExp[] = [
  // eval or Function constructor
  /\beval\s*\(/g,
  /new\s+Function\s*\(/g,
  // large base64 blobs or long single-line files
  /[A-Za-z0-9+/]{100,}={0,2}/g,
  // string concatenation obfuscation patterns
  /\+\s*"[^"]{30,}"/g,
];

export default {
  suspiciousFilenames,
  suspiciousScripts,
  secretPatterns,
  badDependencies,
  urlIndicators,
  obfuscationIndicators,
};
