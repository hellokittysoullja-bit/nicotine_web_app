#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

const PUBLIC_STATUSES = new Set([
  "original",
  "licensed",
  "public-domain",
  "cc",
  "official-embed",
  "user-provided",
]);
const BLOCKED_STATUSES = new Set(["internal-review-only", "unknown"]);
const ALL_STATUSES = new Set([...PUBLIC_STATUSES, ...BLOCKED_STATUSES]);
const NEED_SOURCE = new Set(["licensed", "public-domain", "cc", "official-embed"]);
const NEED_ATTRIBUTION = new Set(["licensed", "public-domain", "cc", "official-embed", "user-provided"]);

const usage = `
Audit a Website Studio media manifest.

Usage:
  node scripts/audit-media.mjs path/to/media-manifest.json
  node scripts/audit-media.mjs --manifest path/to/media-manifest.json [options]

Options:
  --root <directory>      Verify local paths against this project root
  --release-mode <mode>   Override manifest releaseMode: public or internal
  --help                  Show this help

Public releases allow exactly: original, licensed, public-domain, cc,
official-embed, and user-provided. internal-review-only and unknown are blocked.
`;

class CliError extends Error {}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function httpUrl(value) {
  if (!nonEmptyString(value)) return false;
  try {
    return new Set(["http:", "https:"]).has(new URL(value).protocol);
  } catch {
    return false;
  }
}

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (relative !== ".." && !relative.startsWith(`..${path.sep}`));
}

async function main() {
  let parsed;
  try {
    parsed = parseArgs({
      options: {
        help: { type: "boolean" },
        manifest: { type: "string" },
        root: { type: "string" },
        "release-mode": { type: "string" },
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
  if (positionals.length > 1) throw new CliError("Provide only one manifest path.");
  const input = values.manifest ?? positionals[0];
  if (!input) throw new CliError("A media manifest path is required.");

  const manifestPath = path.resolve(process.cwd(), input);
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    throw new CliError(`Cannot read manifest '${manifestPath}': ${error.message}`);
  }
  if (!manifest || Array.isArray(manifest) || typeof manifest !== "object") throw new CliError("Manifest must be a JSON object.");
  if (!nonEmptyString(manifest.project)) throw new CliError("Manifest project must be a non-empty string.");
  if (!Array.isArray(manifest.assets)) throw new CliError("Manifest assets must be an array.");

  const releaseMode = values["release-mode"] ?? manifest.releaseMode;
  if (!new Set(["public", "internal"]).has(releaseMode)) throw new CliError("releaseMode must be 'public' or 'internal'.");
  const root = values.root ? path.resolve(process.cwd(), values.root) : null;
  if (root) {
    try {
      await access(root);
    } catch {
      throw new CliError(`Asset root does not exist: ${root}`);
    }
  }

  const failures = [];
  const ids = new Set();
  const counts = new Map();

  for (const [index, asset] of manifest.assets.entries()) {
    const label = nonEmptyString(asset?.id) ? asset.id : `assets[${index}]`;
    if (!asset || Array.isArray(asset) || typeof asset !== "object") {
      failures.push(`${label}: entry must be an object.`);
      continue;
    }
    if (!nonEmptyString(asset.id)) failures.push(`${label}: id is required.`);
    else if (ids.has(asset.id)) failures.push(`${label}: id is duplicated.`);
    else ids.add(asset.id);

    if (!nonEmptyString(asset.path)) failures.push(`${label}: path is required.`);
    if (!nonEmptyString(asset.type)) failures.push(`${label}: type is required.`);
    if (!ALL_STATUSES.has(asset.status)) failures.push(`${label}: status '${asset.status ?? ""}' is not in the controlled vocabulary.`);
    else counts.set(asset.status, (counts.get(asset.status) ?? 0) + 1);

    for (const field of ["rightsHolder", "licenseOrPermission", "usageScope"]) {
      if (!nonEmptyString(asset[field])) failures.push(`${label}: ${field} is required.`);
    }
    if (!(asset.sourceUrl === null || typeof asset.sourceUrl === "string")) failures.push(`${label}: sourceUrl must be a string or null.`);
    if (typeof asset.attribution !== "string") failures.push(`${label}: attribution must be a string.`);
    if (!(asset.removalContact === null || typeof asset.removalContact === "string")) {
      failures.push(`${label}: removalContact must be a string or null.`);
    }

    if (NEED_SOURCE.has(asset.status) && !httpUrl(asset.sourceUrl)) {
      failures.push(`${label}: status '${asset.status}' requires an HTTP(S) sourceUrl.`);
    }
    if (NEED_ATTRIBUTION.has(asset.status) && !nonEmptyString(asset.attribution)) {
      failures.push(`${label}: status '${asset.status}' requires attribution.`);
    }
    if (asset.status === "official-embed" && !httpUrl(asset.path)) {
      failures.push(`${label}: official-embed path must be the authorised HTTP(S) embed URL, not a local copy.`);
    }

    if (releaseMode === "public") {
      if (!PUBLIC_STATUSES.has(asset.status)) failures.push(`${label}: status '${asset.status ?? ""}' is blocked from public release.`);
      if (!nonEmptyString(asset.usageScope) || !/\bpublic\b/i.test(asset.usageScope) || /internal(?:[- ]review)?[- ]only/i.test(asset.usageScope)) {
        failures.push(`${label}: usageScope does not clearly cover public use.`);
      }
    }

    if (root && nonEmptyString(asset.path) && !httpUrl(asset.path)) {
      const target = path.resolve(root, asset.path.replace(/^[/\\]+/, ""));
      if (!inside(root, target)) failures.push(`${label}: local path escapes --root.`);
      else {
        try {
          await access(target);
        } catch {
          failures.push(`${label}: local asset does not exist under --root: ${asset.path}`);
        }
      }
    }
  }

  if (failures.length > 0) {
    console.error(`Media audit failed for '${manifest.project}' with ${failures.length} problem(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  const summary = [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([status, count]) => `${status}=${count}`).join(", ");
  console.log(`Media audit passed for '${manifest.project}' (${releaseMode} release).`);
  console.log(`Checked ${manifest.assets.length} asset(s)${summary ? `: ${summary}` : "."}`);
}

main().catch((error) => {
  const prefix = error instanceof CliError ? "Usage error" : "Audit error";
  console.error(`${prefix}: ${error.message}`);
  if (error instanceof CliError) console.error("Run with --help for usage.");
  process.exitCode = error instanceof CliError ? 2 : 1;
});
