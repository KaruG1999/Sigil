import fs from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import https from "https";
import AdmZip from "adm-zip";

/**
 * Convierte una URL de GitHub a la URL del ZIP.
 * Ej: https://github.com/user/repo → https://github.com/user/repo/archive/refs/heads/main.zip
 */
function buildZipUrl(repoUrl: string): string {
  const parts = repoUrl.replace("https://github.com/", "").split("/");
  const user = parts[0];
  const repo = parts[1];

  return `https://github.com/${user}/${repo}/archive/refs/heads/main.zip`;
}

/**
 * Descargar un archivo usando HTTPS sin dependencias raras.
 */
function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ZIP: ${res.statusCode}`));
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
    }).on("error", reject);
  });
}

/**
 * Descarga y descomprime un repositorio de GitHub en /tmp
 */
export async function fetchGitHubRepoToTemp(repoUrl: string): Promise<string> {
  const tmpDir = path.join(os.tmpdir(), `sigil-scan-${randomUUID()}`);
  fs.mkdirSync(tmpDir);

  const zipPath = path.join(tmpDir, "repo.zip");
  const zipUrl = buildZipUrl(repoUrl);

  // Descargar ZIP
  await download(zipUrl, zipPath);

  // Extraer ZIP
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(tmpDir, true);

  // Detectar carpeta del repo descomprimido
  const extractedRoot = fs
    .readdirSync(tmpDir)
    .find((f) => fs.statSync(path.join(tmpDir, f)).isDirectory() && f.includes("-main"));

  if (!extractedRoot) {
    throw new Error("Failed to extract repository root folder.");
  }

  return path.join(tmpDir, extractedRoot);
}
