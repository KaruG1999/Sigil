#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
import { scanRepository } from "@sigil/core";
import fs from "fs";
import path from "path";
var program = new Command();
program.name("sigil").description("SIGIL Arcane Node - Repository Scanner").version("0.1.0");
program.command("scan").argument("<repo>", "path or url of the repository to scan").action(async (repo) => {
  try {
    console.log(`\u{1F441}\uFE0F  Iniciando escaneo en: ${repo} ...`);
    if (!/^https?:\/\//.test(repo)) {
      const resolved = path.resolve(process.cwd(), repo);
      if (!fs.existsSync(resolved)) {
        console.error(`\u274C Path not found: ${resolved}`);
        process.exitCode = 2;
        return;
      }
    }
    const { score, findings } = await scanRepository(repo);
    console.log("\n\u{1F52E} SIGIL Scan Result\n");
    console.log(`Score: ${score}
`);
    console.log("Findings:");
    if (!findings || findings.length === 0) {
      console.log(" - [info] No findings detected");
    } else {
      for (const f of findings) {
        console.log(` - [${f.type}] ${f.msg}`);
      }
    }
    console.log("");
  } catch (err) {
    console.error("\u274C Error during scan:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
});
program.parse();
