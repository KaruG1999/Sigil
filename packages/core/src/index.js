"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRepo = scanRepo;
function scanRepo(repoPath) {
    return {
        status: "ok",
        findings: [],
        message: `Repo scanned: ${repoPath}`
    };
}
/* Más adelante acá agregamos:

análisis de archivos

heurísticas de seguridad

llamadas a IA para evaluación del código

detección de patrones sospechosos */ 
