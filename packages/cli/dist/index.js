#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");
var import_core = require("@sigil/core");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var program = new import_commander.Command();
program.name("sigil").description("SIGIL Arcane Node - Repository Scanner").version("0.1.0");
program.command("scan").argument("<repo>", "path or url of the repository to scan").action(async (repo) => {
  try {
    console.log(`\u{1F441}\uFE0F  Iniciando escaneo en: ${repo} ...`);
    if (!/^https?:\/\//.test(repo)) {
      const resolved = import_path.default.resolve(process.cwd(), repo);
      if (!import_fs.default.existsSync(resolved)) {
        console.error(`\u274C Path not found: ${resolved}`);
        process.exitCode = 2;
        return;
      }
    }
    const { score, findings } = await (0, import_core.scanRepository)(repo);
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
