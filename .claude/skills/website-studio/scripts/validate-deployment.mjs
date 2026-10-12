#!/usr/bin/env node

import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";
import { loadConfigFile, normalizeBasePath } from "./validate-config.mjs";

const DEFAULT_PUBLIC_FORBIDDEN = [
  "Your site is taking shape",
  "CODEX IS WORKING",
  "Sign in to continue",
  "Authentication required",
  "401 Unauthorized",
  "This site is private",
];

const usage = `
Validate deployed routes anonymously according to Website Studio accessMode.

Usage:
  node scripts/validate-deployment.mjs --config path/to/site-quality.config.json https://example.com/

Options:
  --asset <path-or-url>  Additional publicly reachable asset to verify; repeatable
  --attempts <count>     Attempts per route or asset (default: 5)
  --delay-ms <number>    Delay between attempts (default: 1500)
  --timeout-ms <number>  Timeout per request (default: 15000)
  --help                 Show this help

public-anonymous routes follow redirects and must return their required content.
authenticated and internal routes use manual redirects and must match each
route's expectedAnonymousStatuses. No Cookie or Authorization header is sent.
`;

class CliError extends Error {}

function integer(value, fallback, name, allowZero = false) {
  const parsed = value === undefined ? fallback : Number(value);
  const minimum = allowZero ? 0 : 1;
  if (!Number.isInteger(parsed) || parsed < minimum) throw new CliError(`${name} must be an integer >= ${minimum}.`);
  return parsed;
}

export function deploymentRoot(input, basePath) {
  let url;
  try {
    url = new URL(input);
  } catch {
    throw new CliError(`Invalid deployment URL: ${input}`);
  }
  if (!new Set(["http:", "https:"]).has(url.protocol)) throw new CliError("Deployment URL must use HTTP or HTTPS.");
  url.search = "";
  url.hash = "";

  if (basePath) {
    if (url.pathname === "/" || url.pathname === "") url.pathname = `${basePath}/`;
    else if (url.pathname === basePath || url.pathname.startsWith(`${basePath}/`)) url.pathname = `${basePath}/`;
    else url.pathname = `${url.pathname.replace(/\/+$/, "")}${basePath}/`;
  } else if (!url.pathname.endsWith("/")) {
    url.pathname = `${url.pathname}/`;
  }
  return url;
}

function routeUrl(root, routePath) {
  if (routePath === "/") return root.href;
  return new URL(routePath.replace(/^\/+/, ""), root).href;
}

function assetUrl(root, asset, basePath) {
  if (/^https?:\/\//i.test(asset)) return new URL(asset).href;
  if (asset.startsWith("/")) {
    let pathname = asset;
    if (basePath && pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
      pathname = `${basePath}/${pathname.replace(/^\/+/, "")}`;
    }
    return new URL(pathname, root.origin).href;
  }
  return new URL(asset.replace(/^\.\//, ""), root).href;
}

function expectedMime(urlValue) {
  const pathname = new URL(urlValue).pathname.toLowerCase();
  if (/\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/.test(pathname)) return /^image\//i;
  if (/\.css$/.test(pathname)) return /^text\/css\b/i;
  if (/\.(?:js|mjs)$/.test(pathname)) return /^(?:application|text)\/(?:javascript|x-javascript)\b/i;
  if (/\.(?:woff2?|ttf|otf)$/.test(pathname)) return /^(?:font\/|application\/(?:font|octet-stream))/i;
  if (/\.(?:mp3|wav|ogg)$/.test(pathname)) return /^audio\//i;
  if (/\.(?:mp4|webm)$/.test(pathname)) return /^video\//i;
  if (/\.json$/.test(pathname)) return /^application\/(?:[a-z0-9.+-]*\+)?json\b/i;
  return null;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function requestWithRetries(url, label, settings, options, inspect) {
  let lastError;
  for (let attempt = 1; attempt <= settings.attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: options.redirect,
        cache: "no-store",
        headers: {
          accept: options.accept,
          "user-agent": "website-studio-deployment-validator/1.0",
        },
        signal: AbortSignal.timeout(settings.timeoutMs),
      });
      return await inspect(response);
    } catch (error) {
      lastError = error;
      if (attempt < settings.attempts) {
        console.error(`Retrying ${label} (${attempt}/${settings.attempts}): ${error.message}`);
        await wait(settings.delayMs);
      }
    }
  }
  throw new Error(`${label} '${url}' failed after ${settings.attempts} attempt(s): ${lastError?.message ?? "unknown error"}`);
}

export async function inspectPublicRoute(response, route, config, basePath) {
  const expected = route.expectedAnonymousStatuses ?? [200];
  if (!expected.includes(response.status)) {
    await response.body?.cancel();
    throw new Error(`expected anonymous status ${expected.join("/")}, received ${response.status}`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!/^text\/html\b/i.test(contentType)) {
    await response.body?.cancel();
    throw new Error(`expected text/html, received '${contentType || "missing Content-Type"}'`);
  }
  const finalUrl = new URL(response.url);
  if (/\/(?:auth|login|log-in|signin|sign-in)(?:\/|$)/i.test(finalUrl.pathname)) {
    await response.body?.cancel();
    throw new Error(`redirected to an authentication path: ${finalUrl.pathname}`);
  }
  if (basePath && finalUrl.pathname !== basePath && !finalUrl.pathname.startsWith(`${basePath}/`)) {
    await response.body?.cancel();
    throw new Error(`final path '${finalUrl.pathname}' does not include basePath '${basePath}'`);
  }
  const html = await response.text();
  for (const text of route.requiredText ?? []) {
    if (!html.includes(text)) throw new Error(`missing required text ${JSON.stringify(text)}`);
  }
  const lower = html.toLowerCase();
  for (const text of new Set([...DEFAULT_PUBLIC_FORBIDDEN, ...(config.forbiddenText ?? [])])) {
    if (text && lower.includes(text.toLowerCase())) throw new Error(`contains forbidden or private-screen text ${JSON.stringify(text)}`);
  }
  if (/<title\b[^>]*>[^<]*(?:sign in|log in|unauthorized|access denied)/i.test(html)) {
    throw new Error("page title appears to be an authentication or access-denied screen");
  }
  return { status: response.status, finalUrl: finalUrl.href, contentType };
}

export async function inspectProtectedRoute(response, route) {
  const expected = route.expectedAnonymousStatuses;
  if (!expected.includes(response.status)) {
    await response.body?.cancel();
    throw new Error(`expected anonymous status ${expected.join("/")}, received ${response.status}`);
  }
  if (response.status >= 300 && response.status < 400 && !response.headers.get("location")) {
    await response.body?.cancel();
    throw new Error(`${response.status} response is missing a Location header`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  await response.body?.cancel();
  return { status: response.status, finalUrl: response.url, contentType };
}

export async function inspectAsset(response, url) {
  if (response.status !== 200) {
    await response.body?.cancel();
    throw new Error(`expected 200, received ${response.status}`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType) {
    await response.body?.cancel();
    throw new Error("missing Content-Type");
  }
  if (/^text\/html\b/i.test(contentType) && !/\.html?$/i.test(new URL(url).pathname)) {
    await response.body?.cancel();
    throw new Error(`asset returned HTML instead of media (${contentType})`);
  }
  const pattern = expectedMime(response.url || url);
  if (pattern && !pattern.test(contentType)) {
    await response.body?.cancel();
    throw new Error(`unexpected Content-Type '${contentType}'`);
  }
  if (response.headers.get("content-length") === "0") {
    await response.body?.cancel();
    throw new Error("empty asset response");
  }
  await response.body?.cancel();
  return { status: response.status, contentType, finalUrl: response.url };
}

async function main() {
  let parsed;
  try {
    parsed = parseArgs({
      options: {
        help: { type: "boolean" },
        config: { type: "string" },
        asset: { type: "string", multiple: true },
        attempts: { type: "string" },
        "delay-ms": { type: "string" },
        "timeout-ms": { type: "string" },
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
  if (!values.config) throw new CliError("--config is required.");
  if (positionals.length !== 1) throw new CliError("Provide exactly one deployment URL.");

  const loaded = await loadConfigFile(values.config);
  if (loaded.errors.length > 0) {
    console.error(`Configuration has ${loaded.errors.length} problem(s):`);
    for (const error of loaded.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  for (const warning of loaded.warnings) console.warn(`Warning: ${warning}`);
  const config = loaded.config;
  const basePath = normalizeBasePath(config.basePath);
  const root = deploymentRoot(positionals[0], basePath);
  const settings = {
    attempts: integer(values.attempts, 5, "attempts"),
    delayMs: integer(values["delay-ms"], 1500, "delay-ms", true),
    timeoutMs: integer(values["timeout-ms"], 15000, "timeout-ms"),
  };

  const routeResults = [];
  const publicAccess = config.accessMode === "public-anonymous";
  for (const route of config.routes) {
    const url = routeUrl(root, route.path);
    const result = await requestWithRetries(url, `route ${route.path}`, settings, {
      redirect: publicAccess ? "follow" : "manual",
      accept: "text/html,application/xhtml+xml,application/json;q=0.8,*/*;q=0.2",
    }, (response) => publicAccess
      ? inspectPublicRoute(response, route, config, basePath)
      : inspectProtectedRoute(response, route));
    routeResults.push({ route: route.path, ...result });
  }

  const configuredAssets = publicAccess ? config.criticalAssets ?? [] : [];
  const requestedAssets = values.asset ?? [];
  const assetUrls = new Set([...configuredAssets, ...requestedAssets].map((asset) => assetUrl(root, asset, basePath)));
  for (const url of assetUrls) {
    await requestWithRetries(url, "asset", settings, {
      redirect: "follow",
      accept: "*/*",
    }, (response) => inspectAsset(response, url));
  }

  console.log(`Deployment validation passed: ${root.href}`);
  console.log(`${config.accessMode} · ${routeResults.length} anonymous route check(s) · ${assetUrls.size} public asset check(s)`);
  if (!publicAccess && configuredAssets.length === 0 && requestedAssets.length === 0) {
    console.warn("Protected deployment: asset MIME checks were skipped. Supply --asset for intentionally public assets and test protected assets in an authenticated browser.");
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((error) => {
    const prefix = error instanceof CliError ? "Usage error" : "Deployment validation failed";
    console.error(`${prefix}: ${error.message}`);
    if (error instanceof CliError) console.error("Run with --help for usage.");
    process.exitCode = error instanceof CliError ? 2 : 1;
  });
}
