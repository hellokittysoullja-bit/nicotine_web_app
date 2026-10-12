#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { loadConfigFile } from "./validate-config.mjs";

const SKIP_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".nuxt",
  ".output",
  ".svelte-kit",
  ".turbo",
  ".vercel",
  ".wrangler",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "target",
  "vendor",
]);
const SOURCE_EXTENSION = /\.(?:astro|css|html|js|jsx|mdx|mjs|scss|svelte|ts|tsx|vue)$/i;
const MAX_FILES = 5000;
const MAX_SOURCE_FILES = 400;
const MAX_SOURCE_BYTES = 384 * 1024;

const usage = `
Inspect an existing website project without modifying it.

Usage:
  node scripts/inspect-project.mjs [project-directory]
  node scripts/inspect-project.mjs [project-directory] --config path/to/site-quality.config.json --json

Reports stack, package scripts, quality configuration, deployment hints, routes,
and capabilities relevant to Website Studio. Environment files are never read.
`;

class CliError extends Error {}

async function walk(root, directory = root, files = []) {
  if (files.length >= MAX_FILES) return files;
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (files.length >= MAX_FILES) break;
    if (entry.isDirectory() && SKIP_DIRECTORIES.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(root, absolute, files);
    else if (entry.isFile()) files.push(path.relative(root, absolute).replaceAll(path.sep, "/"));
  }
  return files;
}

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return null;
  }
}

function dependencySet(packageJson) {
  return new Set([
    ...Object.keys(packageJson?.dependencies ?? {}),
    ...Object.keys(packageJson?.devDependencies ?? {}),
  ]);
}

function includesAny(set, values) {
  return values.some((value) => set.has(value));
}

function detectStack(files, dependencies) {
  const has = (pattern) => files.some((file) => pattern.test(file));
  const stack = [];
  if (dependencies.has("next") || has(/(^|\/)next\.config\./i)) stack.push("Next.js");
  else if (dependencies.has("nuxt") || has(/(^|\/)nuxt\.config\./i)) stack.push("Nuxt");
  else if (dependencies.has("@sveltejs/kit") || has(/(^|\/)svelte\.config\./i)) stack.push("SvelteKit");
  else if (dependencies.has("astro") || has(/(^|\/)astro\.config\./i)) stack.push("Astro");
  else if (includesAny(dependencies, ["@remix-run/react", "@remix-run/node"]) || has(/(^|\/)remix\.config\./i)) stack.push("Remix");
  else if (dependencies.has("gatsby") || has(/(^|\/)gatsby-config\./i)) stack.push("Gatsby");
  else if (dependencies.has("vite") || has(/(^|\/)vite\.config\./i)) stack.push("Vite");
  else if (has(/(^|\/)hugo\.(?:toml|yaml|yml)$/i) || has(/(^|\/)config\.(?:toml|yaml|yml)$/i) && has(/(^|\/)layouts\//i)) stack.push("Hugo");
  else if (has(/(^|\/)index\.html$/i)) stack.push("Static HTML");
  else stack.push("Unknown web stack");

  if (dependencies.has("react")) stack.push("React");
  if (dependencies.has("vue")) stack.push("Vue");
  if (dependencies.has("svelte")) stack.push("Svelte");
  if (dependencies.has("tailwindcss")) stack.push("Tailwind CSS");
  return stack;
}

function inferRenderMode(stack) {
  if (stack.includes("Static HTML") || stack.includes("Hugo") || stack.includes("Astro") || stack.includes("Gatsby")) return "static";
  if (stack.includes("Vite")) return "spa";
  if (["Next.js", "Nuxt", "SvelteKit", "Remix"].some((item) => stack.includes(item))) return "ssr-or-hybrid";
  return "unknown";
}

function detectPackageManager(files) {
  if (files.includes("pnpm-lock.yaml")) return "pnpm";
  if (files.includes("yarn.lock")) return "yarn";
  if (files.includes("bun.lock") || files.includes("bun.lockb")) return "bun";
  if (files.includes("package-lock.json")) return "npm";
  return "not detected";
}

function evidence(files, patterns, limit = 5) {
  return files.filter((file) => patterns.some((pattern) => pattern.test(file))).slice(0, limit);
}

async function sourceCorpus(root, files) {
  const chunks = [];
  for (const relative of files.filter((file) => SOURCE_EXTENSION.test(file)).slice(0, MAX_SOURCE_FILES)) {
    const absolute = path.join(root, relative);
    try {
      const info = await stat(absolute);
      if (info.size > MAX_SOURCE_BYTES) continue;
      chunks.push({ file: relative, text: await readFile(absolute, "utf8") });
    } catch {
      // Inspection is best effort; unreadable files are reported through evidence gaps.
    }
  }
  return chunks;
}

function textEvidence(corpus, pattern, limit = 5) {
  return corpus.filter((entry) => pattern.test(entry.text)).map((entry) => entry.file).slice(0, limit);
}

async function main() {
  let parsed;
  try {
    parsed = parseArgs({
      options: {
        help: { type: "boolean" },
        config: { type: "string" },
        json: { type: "boolean" },
      },
      allowPositionals: true,
      strict: true,
    });
  } catch (error) {
    throw new CliError(error.message);
  }
  const { values, positionals } = parsed;
  if (values.help) {
    console.log(usage.trim());
    return;
  }
  if (positionals.length > 1) throw new CliError("Provide only one project directory.");

  const root = path.resolve(process.cwd(), positionals[0] ?? ".");
  try {
    if (!(await stat(root)).isDirectory()) throw new Error("not a directory");
  } catch {
    throw new CliError(`Project directory does not exist: ${root}`);
  }

  const files = await walk(root);
  const packageJson = files.includes("package.json") ? await readJson(path.join(root, "package.json")) : null;
  const dependencies = dependencySet(packageJson);
  const stack = detectStack(files, dependencies);
  const corpus = await sourceCorpus(root, files);

  const routeEvidence = evidence(files, [
    /(^|\/)app\/(?:.*\/)?page\.(?:js|jsx|ts|tsx)$/i,
    /(^|\/)pages\/.*\.(?:js|jsx|ts|tsx|vue)$/i,
    /\.html$/i,
  ], 20);
  const deploymentEvidence = evidence(files, [
    /(^|\/)\.github\/workflows\/.+\.ya?ml$/i,
    /(^|\/)(?:netlify\.toml|vercel\.json|wrangler\.(?:jsonc?|toml)|firebase\.json)$/i,
    /(^|\/)Dockerfile$/i,
  ], 10);
  const envFiles = files.filter((file) => /(^|\/)\.env(?:\.|$)/.test(file)).slice(0, 10);

  const capabilities = {
    routes: routeEvidence,
    forms: textEvidence(corpus, /<form\b|\buseForm\b|\bFormData\b/),
    dataFetching: textEvidence(corpus, /\bfetch\s*\(|\baxios\b|\buseQuery\b|\bloader\s*[:=(]|\bserver action\b/i),
    authentication: [
      ...new Set([
        ...["@auth/core", "@clerk/nextjs", "better-auth", "firebase", "next-auth", "supabase"].filter((name) => dependencies.has(name)).map((name) => `dependency:${name}`),
        ...textEvidence(corpus, /\b(?:auth|session|signIn|signOut|currentUser)\b/i),
        ...evidence(files, [/(^|\/)(?:auth|middleware)\.(?:js|jsx|ts|tsx)$/i]),
      ]),
    ],
    charts: [
      ...["chart.js", "d3", "echarts", "plotly.js", "recharts", "vega"].filter((name) => dependencies.has(name)).map((name) => `dependency:${name}`),
      ...textEvidence(corpus, /\b(?:recharts|chart\.js|echarts|d3|vega|plotly)\b/i),
    ],
    persistence: [
      ...["@prisma/client", "drizzle-orm", "firebase", "prisma", "supabase"].filter((name) => dependencies.has(name)).map((name) => `dependency:${name}`),
      ...textEvidence(corpus, /\b(?:prisma|drizzle|supabase|firebase|localStorage|indexedDB)\b/i),
    ],
    loadingEmptyErrorStates: textEvidence(corpus, /\b(?:loading|empty|no results|error|retry|skeleton)\b/i),
    accessibilityTooling: includesAny(dependencies, ["@axe-core/playwright", "axe-core", "jest-axe", "pa11y"])
      ? ["dependency"] : textEvidence(corpus, /\b(?:axe-core|pa11y|jest-axe)\b/i),
    browserTesting: includesAny(dependencies, ["@playwright/test", "playwright", "cypress"])
      ? ["dependency"] : evidence(files, [/(^|\/)(?:playwright|cypress)\.config\./i]),
    mediaManifest: evidence(files, [/(^|\/)media-manifest(?:\.[^.]+)?\.json$/i, /(^|\/)media-manifest\.json$/i]),
    sourceLedger: evidence(files, [/(^|\/)source-ledger.*\.csv$/i]),
  };

  const configCandidate = values.config
    ? path.resolve(root, values.config)
    : files.filter((file) => path.basename(file) === "site-quality.config.json")
      .sort((a, b) => a.split("/").length - b.split("/").length)[0];
  let configuration = null;
  if (configCandidate) {
    const configPath = path.isAbsolute(configCandidate) ? configCandidate : path.join(root, configCandidate);
    try {
      const checked = await loadConfigFile(configPath);
      configuration = {
        path: path.relative(root, checked.configPath) || path.basename(checked.configPath),
        valid: checked.errors.length === 0,
        siteType: checked.config.siteType,
        renderMode: checked.config.renderMode,
        accessMode: checked.config.accessMode,
        errors: checked.errors,
        warnings: checked.warnings,
      };
    } catch (error) {
      configuration = { path: path.relative(root, configPath), valid: false, errors: [error.message], warnings: [] };
    }
  }

  const scripts = packageJson?.scripts ?? {};
  const warnings = [];
  if (files.length >= MAX_FILES) warnings.push(`File scan stopped at ${MAX_FILES} files.`);
  if (!configuration) warnings.push("No site-quality.config.json was detected.");
  if (packageJson && !scripts.build) warnings.push("package.json has no build script.");
  if (configuration && configuration.renderMode && ["static", "spa"].includes(inferRenderMode(stack))
      && configuration.renderMode !== inferRenderMode(stack)) {
    warnings.push(`Configured renderMode '${configuration.renderMode}' differs from the inferred '${inferRenderMode(stack)}' profile.`);
  }
  if (APP_LIKE(configuration?.siteType) && capabilities.loadingEmptyErrorStates.length === 0) {
    warnings.push("No obvious loading, empty, or error-state implementation was detected for the configured app-like site.");
  }

  const report = {
    root,
    filesScanned: files.length,
    sourceFilesInspected: corpus.length,
    stack,
    inferredRenderMode: inferRenderMode(stack),
    packageManager: detectPackageManager(files),
    packageScripts: scripts,
    configuration,
    capabilities,
    deployment: deploymentEvidence,
    environmentFilesDetectedButNotRead: envFiles,
    warnings,
  };

  if (values.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`Website Studio inspection: ${root}`);
  console.log(`Stack: ${stack.join(" + ")} · inferred render: ${report.inferredRenderMode} · package manager: ${report.packageManager}`);
  console.log(`Files: ${report.filesScanned} scanned, ${report.sourceFilesInspected} source files inspected`);
  console.log(`Scripts: ${Object.keys(scripts).length ? Object.keys(scripts).join(", ") : "none detected"}`);
  console.log(`Config: ${configuration ? `${configuration.path} (${configuration.valid ? "valid" : "invalid"})` : "not detected"}`);
  const presentCapabilities = Object.entries(capabilities).filter(([, value]) => value.length > 0).map(([name]) => name);
  console.log(`Capabilities: ${presentCapabilities.length ? presentCapabilities.join(", ") : "none detected"}`);
  console.log(`Deployment hints: ${deploymentEvidence.length ? deploymentEvidence.join(", ") : "none detected"}`);
  if (envFiles.length) console.log(`Environment files detected but not read: ${envFiles.join(", ")}`);
  for (const warning of [...(configuration?.warnings ?? []), ...(configuration?.errors ?? []), ...warnings]) console.warn(`Warning: ${warning}`);
}

function APP_LIKE(siteType) {
  return new Set(["dashboard", "portal-internal", "tracker-workflow"]).has(siteType);
}

main().catch((error) => {
  const prefix = error instanceof CliError ? "Usage error" : "Inspection error";
  console.error(`${prefix}: ${error.message}`);
  if (error instanceof CliError) console.error("Run with --help for usage.");
  process.exitCode = error instanceof CliError ? 2 : 1;
});
