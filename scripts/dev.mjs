import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const patientRoot = resolve(root, "patient_mobile");
const envFile = resolve(root, ".env.local");

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

function startNext(cwd, port, label) {
  const nextCli = resolve(cwd, "node_modules", "next", "dist", "bin", "next");
  const child = spawn(process.execPath, [nextCli, "dev", "--port", String(port)], {
    cwd,
    env: process.env,
    stdio: "inherit",
  });

  child.on("error", (error) => {
    console.error(`[${label}] Failed to start: ${error.message}`);
  });

  return child;
}

console.log("Starting TULAY staff portal on http://localhost:3000");
console.log("Starting TULAY patient portal on http://localhost:3000/patient");

const children = [
  startNext(root, 3000, "staff"),
  startNext(patientRoot, 3100, "patient"),
];

let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;

  for (const child of children) {
    if (!child.killed) child.kill();
  }

  setTimeout(() => process.exit(exitCode), 250);
}

for (const child of children) {
  child.on("exit", (code, signal) => {
    if (stopping) return;
    console.error(`A TULAY development server stopped (${signal ?? `exit ${code ?? 1}`}).`);
    stop(code ?? 1);
  });
}

process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
