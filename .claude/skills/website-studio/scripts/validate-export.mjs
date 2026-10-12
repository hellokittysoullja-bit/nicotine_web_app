#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { loadConfigFile, normalizeBasePath } from "./validate-config.mjs";

const CONTENT_SITE_TYPES = new Set([
  "landing-page",
  "portfolio",
  "editorial-story",
  "knowledge-hub",
  "directory-catalog",
]);
const DEFAULT_FORBIDDEN = [
  "Your site is taking shape",
  "CODEX IS WORKING",
  "Lorem ipsum",
  "REPLACE_ME",
];

const usage = `
Validate a static or SPA build described by a Website Studio config.

Usage:
  node scripts/validate-export.mjs --config path/to/site-quality.config.json
  node scripts/validate-export.mjs path/to/site-quality.config.json [--root path/to/output]

The validator checks configured routes, required files, critical assets, metadata,
language, headings for static pages, image alternatives, iframe titles, basePath,
and local src, href, poster, srcset, inline style, and CSS url() references.
SSR projects must use build tests and validate-deployment instead.
`;

class CliError extends Error {}

function decodeEntities(value) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 16)))
    .replace(/&#([0-9]+);/g, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 10)));
}

function attributes(tag) {
  const result = new Map();
  const pattern = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of tag.matchAll(pattern)) {
    result.set(match[1].toLowerCase(), decodeEntities(match[2] ?? match[3] ?? match[4] ?? ""));
  }
  return result;
}

function cssUrls(css) {
  const urls = [];
  const pattern = /url\(\s*(?:(['"])(.*?)\1|([^)'"\s][^)]*?))\s*\)/gi;
  for (const match of css.matchAll(pattern)) urls.push((match[2] ?? match[3] ?? "").trim());
  return urls;
}

function srcsetUrls(value) {
  if (value.trim().toLowerCase().startsWith("data:")) return [];
  return value.split(",").map((part) => part.trim().split(/\s+/, 1)[0]).filter(Boolean);
}

function ignoredReference(value) {
  return !value || value.startsWith("#") || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value);
}

function cleanReference(value) {
  const clean = decodeEntities(value.trim()).split(/[?#]/, 1)[0].replace(/\\/g, "/");
  if (!clean) return "";
  try {
    return decodeURIComponent(clean);
  } catch {
    return clean;
  }
}

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (relative !== ".." && !relative.startsWith(`..${path.sep}`));
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (entry.isFile()) files.push(target);
  }
  return files;
}

function routeKey(value) {
  if (value === "/") return "/";
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

function routeCandidates(root, route) {
  if (route.file) return [path.resolve(root, route.file)];
  const clean = routeKey(route.path).replace(/^\/+/, "");
  if (!clean) return [path.join(root, "index.html")];
  return [path.join(root, clean, "index.html"), path.join(root, `${clean}.html`)];
}

function declaredPath(root, value, basePath) {
  let clean = cleanReference(value);
  if (basePath && (clean === basePath || clean.startsWith(`${basePath}/`))) clean = clean.slice(basePath.length);
  return path.resolve(root, clean.replace(/^\/+/, ""));
}

function referenceTargets(root, sourceFile, raw, basePath, failures) {
  let reference = cleanReference(raw);
  if (!reference || ignoredReference(raw.trim())) return [];
  let target;
  if (reference.startsWith("/")) {
    if (basePath && reference !== basePath && !reference.startsWith(`${basePath}/`)) {
      failures.push(`${path.relative(root, sourceFile)}: root-relative URL '${raw}' does not include basePath '${basePath}'.`);
      return [];
    }
    if (basePath) reference = reference.slice(basePath.length);
    target = path.resolve(root, reference.replace(/^\/+/, ""));
  } else {
    target = path.resolve(path.dirname(sourceFile), reference);
  }
  if (!inside(root, target)) {
    failures.push(`${path.relative(root, sourceFile)}: local URL '${raw}' escapes outputDir.`);
    return [];
  }
  const candidates = [target];
  if (reference.endsWith("/")) candidates.push(path.join(target, "index.html"));
  if (!path.extname(target)) {
    candidates.push(`${target}.html`);
    candidates.push(path.join(target, "index.html"));
  }
  return candidates;
}

function logicalHref(root, sourceFile, raw, basePath) {
  let reference = cleanReference(raw);
  if (!reference) return null;
  if (reference.startsWith("/")) {
    if (basePath && (reference === basePath || reference.startsWith(`${basePath}/`))) reference = reference.slice(basePath.length) || "/";
    return routeKey(reference);
  }
  const sourceDirectory = path.posix.dirname(path.relative(root, sourceFile).replaceAll(path.sep, "/"));
  return routeKey(path.posix.resolve("/", sourceDirectory, reference));
}

function extractReferences(html) {
  const references = [];
  const accessibility = [];
  for (const match of html.matchAll(/<[^>]+>/g)) {
    const tag = match[0];
    if (/^<\s*(?:\/|!|\?)/.test(tag)) continue;
    const tagName = tag.match(/^<\s*([a-z0-9:-]+)/i)?.[1]?.toLowerCase();
    const attrs = attributes(tag);
    if (tagName === "img" && !attrs.has("alt")) accessibility.push("<img> is missing an alt attribute.");
    if (tagName === "iframe" && !attrs.get("title")?.trim()) accessibility.push("<iframe> is missing a non-empty title.");
    for (const name of ["src", "href", "poster"]) {
      if (attrs.has(name)) references.push({ value: attrs.get(name), attribute: name });
    }
    if (attrs.has("srcset")) {
      for (const value of srcsetUrls(attrs.get("srcset"))) references.push({ value, attribute: "srcset" });
    }
    if (attrs.has("style")) {
      for (const value of cssUrls(attrs.get("style"))) references.push({ value, attribute: "css-url" });
    }
  }
  for (const match of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    for (const value of cssUrls(match[1])) references.push({ value, attribute: "css-url" });
  }
  return { references, accessibility };
}

function checkPageMetadata(html, label, config, { requireHeading, requiredText }, failures) {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0];
  if (!htmlTag || !attributes(htmlTag).get("lang")?.trim()) failures.push(`${label}: <html lang> is missing or empty.`);
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();
  if (!title) failures.push(`${label}: a non-empty <title> is required.`);
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const hasMeta = (key, value) => metas.some((item) => item.get(key)?.toLowerCase() === value && item.get("content")?.trim());
  if (!metas.some((item) => item.has("charset"))) failures.push(`${label}: charset metadata is required.`);
  if (!hasMeta("name", "viewport")) failures.push(`${label}: viewport metadata is required.`);
  if (CONTENT_SITE_TYPES.has(config.siteType) && !hasMeta("name", "description")) {
    failures.push(`${label}: this site type requires a non-empty meta description.`);
  }
  if (requireHeading) {
    const count = [...html.matchAll(/<h1\b/gi)].length;
    if (count !== 1) failures.push(`${label}: expected exactly one <h1>; found ${count}.`);
  }
  for (const text of requiredText ?? []) {
    if (!html.includes(text)) failures.push(`${label}: missing required text ${JSON.stringify(text)}.`);
  }
  const lower = html.toLowerCase();
  for (const text of new Set([...DEFAULT_FORBIDDEN, ...(config.forbiddenText ?? [])])) {
    if (text && lower.includes(text.toLowerCase())) failures.push(`${label}: contains forbidden placeholder text ${JSON.stringify(text)}.`);
  }
}

async function main() {
  let parsed;
  try {
    parsed = parseArgs({
      options: {
        help: { type: "boolean" },
        config: { type: "string" },
        root: { type: "string" },
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
  if (positionals.length > 1) throw new CliError("Provide only one config path.");
  if (values.config && positionals[0]) throw new CliError("Provide the config either positionally or with --config, not both.");

  const loaded = await loadConfigFile(values.config ?? positionals[0]);
  if (loaded.errors.length > 0) {
    console.error(`Configuration has ${loaded.errors.length} problem(s):`);
    for (const error of loaded.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  for (const warning of loaded.warnings) console.warn(`Warning: ${warning}`);
  const config = loaded.config;
  if (config.renderMode === "ssr") throw new CliError("validate-export does not apply to renderMode 'ssr'; run the framework build and validate-deployment instead.");

  const root = values.root ? path.resolve(process.cwd(), values.root) : loaded.outputRoot;
  try {
    await access(root);
  } catch {
    throw new CliError(`outputDir does not exist: ${root}`);
  }
  const allFiles = await walk(root);
  const fileSet = new Set(allFiles.map((file) => path.resolve(file)));
  const basePath = normalizeBasePath(config.basePath);
  const failures = [];

  for (const required of config.requiredFiles ?? []) {
    const target = declaredPath(root, required, basePath);
    if (!inside(root, target) || !fileSet.has(target)) failures.push(`Missing required file: ${required}`);
  }
  for (const asset of config.criticalAssets ?? []) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(asset)) {
      failures.push(`criticalAssets must be local export paths, not URLs: ${asset}`);
      continue;
    }
    const target = declaredPath(root, asset, basePath);
    if (!inside(root, target) || !fileSet.has(target)) failures.push(`Missing critical asset: ${asset}`);
  }

  const routePaths = new Set(config.routes.map((route) => routeKey(route.path)));
  const routeFiles = new Map();
  if (config.renderMode === "static") {
    for (const route of config.routes) {
      const candidates = routeCandidates(root, route);
      const match = candidates.find((candidate) => fileSet.has(path.resolve(candidate)));
      if (!match) failures.push(`Route '${route.path}' has no exported HTML file; checked ${candidates.map((file) => path.relative(root, file)).join(" and ")}.`);
      else routeFiles.set(route.path, match);
    }
  } else {
    const declaredEntries = config.routes.map((route) => route.file).filter(Boolean);
    const entry = path.resolve(root, declaredEntries[0] ?? "index.html");
    if (!fileSet.has(entry)) failures.push(`SPA entry HTML is missing: ${path.relative(root, entry)}`);
    else for (const route of config.routes) routeFiles.set(route.path, entry);
  }

  const metadataChecked = new Set();
  for (const route of config.routes) {
    const file = routeFiles.get(route.path);
    if (!file) continue;
    if (config.renderMode === "spa" && metadataChecked.has(file)) continue;
    const html = await readFile(file, "utf8");
    checkPageMetadata(html, `Route '${route.path}'`, config, {
      requireHeading: config.renderMode === "static",
      requiredText: config.renderMode === "static" ? route.requiredText : [],
    }, failures);
    metadataChecked.add(file);
  }

  let referenceCount = 0;
  const htmlFiles = allFiles.filter((file) => file.toLowerCase().endsWith(".html"));
  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    const extracted = extractReferences(html);
    for (const issue of extracted.accessibility) failures.push(`${path.relative(root, htmlFile)}: ${issue}`);
    for (const reference of extracted.references) {
      if (ignoredReference(reference.value)) continue;
      referenceCount += 1;
      const candidates = referenceTargets(root, htmlFile, reference.value, basePath, failures);
      if (candidates.some((candidate) => fileSet.has(path.resolve(candidate)))) continue;
      if (config.renderMode === "spa" && reference.attribute === "href") {
        const logical = logicalHref(root, htmlFile, reference.value, basePath);
        if (logical && routePaths.has(logical)) continue;
      }
      if (candidates.length > 0) failures.push(`${path.relative(root, htmlFile)}: local ${reference.attribute} does not resolve: ${reference.value}`);
    }
  }

  const cssFiles = allFiles.filter((file) => file.toLowerCase().endsWith(".css"));
  for (const cssFile of cssFiles) {
    const css = await readFile(cssFile, "utf8");
    for (const reference of cssUrls(css)) {
      if (ignoredReference(reference)) continue;
      referenceCount += 1;
      const candidates = referenceTargets(root, cssFile, reference, basePath, failures);
      if (candidates.length > 0 && !candidates.some((candidate) => fileSet.has(path.resolve(candidate)))) {
        failures.push(`${path.relative(root, cssFile)}: CSS url() does not resolve: ${reference}`);
      }
    }
  }

  if (config.renderMode === "spa") {
    console.warn("SPA route headings, requiredText, rendered accessibility, and deep-link fallback require browser/deployment validation.");
  }
  if (failures.length > 0) {
    console.error(`Export validation failed with ${failures.length} problem(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Export validation passed: ${root}`);
  console.log(`${config.renderMode} · ${config.routes.length} route(s) · ${htmlFiles.length} HTML · ${cssFiles.length} CSS · ${referenceCount} local reference(s)`);
}

main().catch((error) => {
  const prefix = error instanceof CliError ? "Usage error" : "Export validation error";
  console.error(`${prefix}: ${error.message}`);
  if (error instanceof CliError) console.error("Run with --help for usage.");
  process.exitCode = error instanceof CliError ? 2 : 1;
});
