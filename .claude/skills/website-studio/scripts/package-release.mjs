#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (process.argv.includes("--help")) {
  console.log("Create dist/website-studio-v<version>.zip from the committed HEAD tree.");
  process.exit(0);
}

const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const dist = path.join(root, "dist");
const output = path.join(dist, `website-studio-v${pkg.version}.zip`);

await mkdir(dist, { recursive: true });

try {
  execFileSync("git", [
    "archive",
    "--format=zip",
    "--prefix=website-studio/",
    "-o",
    output,
    "HEAD",
  ], { cwd: root, stdio: "inherit" });
} catch {
  console.error("Unable to package HEAD. Commit the release tree and ensure git is installed.");
  process.exit(1);
}

console.log(path.relative(root, output));
