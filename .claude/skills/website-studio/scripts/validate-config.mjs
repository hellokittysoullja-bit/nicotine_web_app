#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

export const SITE_TYPES = Object.freeze([
  "landing-page",
  "portfolio",
  "editorial-story",
  "knowledge-hub",
  "directory-catalog",
  "dashboard",
  "portal-internal",
  "tracker-workflow",
]);
export const RENDER_MODES = Object.freeze(["static", "spa", "ssr"]);
export const ACCESS_MODES = Object.freeze(["public-anonymous", "authenticated", "internal"]);

const APP_SITE_TYPES = new Set(["dashboard", "portal-internal", "tracker-workflow"]);
const STATEFUL_SITE_TYPES = new Set(["dashboard", "knowledge-hub", "directory-catalog", "portal-internal", "tracker-workflow"]);

const usage = `
Validate a Website Studio quality configuration.

Usage:
  node scripts/validate-config.mjs path/to/site-quality.config.json
  node scripts/validate-config.mjs --config path/to/site-quality.config.json [--json]

If no path is supplied, ./site-quality.config.json is used.
`;

export class ConfigValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = "ConfigValidationError";
    this.errors = errors;
  }
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function checkStringArray(value, label, errors, { required = false } = {}) {
  if (value === undefined && !required) return [];
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array of strings.`);
    return [];
  }
  value.forEach((item, index) => {
    if (!nonEmptyString(item)) errors.push(`${label}[${index}] must be a non-empty string.`);
  });
  return value.filter(nonEmptyString);
}

export function normalizeBasePath(value) {
  if (value === "" || value === "/") return "";
  return value.replace(/\/+$/, "");
}

function validRoutePath(value) {
  return nonEmptyString(value)
    && value.startsWith("/")
    && !/[?#]/.test(value)
    && !value.includes("\\")
    && !value.split("/").includes("..");
}

function validRelativeFile(value) {
  if (!nonEmptyString(value) || path.isAbsolute(value) || value.includes("\\")) return false;
  const normalized = path.posix.normalize(value);
  return normalized !== ".." && !normalized.startsWith("../");
}

export function validateConfigObject(config) {
  const errors = [];
  const warnings = [];

  if (!isObject(config)) return { errors: ["Configuration must be a JSON object."], warnings };

  if (!SITE_TYPES.includes(config.siteType)) {
    errors.push(`siteType must be one of: ${SITE_TYPES.join(", ")}.`);
  }
  if (!RENDER_MODES.includes(config.renderMode)) {
    errors.push(`renderMode must be one of: ${RENDER_MODES.join(", ")}.`);
  }
  if (!ACCESS_MODES.includes(config.accessMode)) {
    errors.push(`accessMode must be one of: ${ACCESS_MODES.join(", ")}.`);
  }
  if (!nonEmptyString(config.outputDir)) errors.push("outputDir must be a non-empty string.");
  if (typeof config.basePath !== "string") {
    errors.push("basePath must be a string.");
  } else if (config.basePath !== "" && config.basePath !== "/") {
    if (!config.basePath.startsWith("/") || /[?#]/.test(config.basePath) || config.basePath.split("/").includes("..")) {
      errors.push("basePath must be empty or an absolute URL path without a query, fragment, or '..'.");
    }
  }

  checkStringArray(config.requiredFiles, "requiredFiles", errors);
  checkStringArray(config.criticalAssets, "criticalAssets", errors);
  checkStringArray(config.forbiddenText, "forbiddenText", errors);

  const routes = config.routes;
  const routePaths = new Set();
  if (!Array.isArray(routes) || routes.length === 0) {
    errors.push("routes must be a non-empty array.");
  } else {
    routes.forEach((route, index) => {
      const label = `routes[${index}]`;
      if (!isObject(route)) {
        errors.push(`${label} must be an object.`);
        return;
      }
      if (!validRoutePath(route.path)) errors.push(`${label}.path must begin with '/' and contain no query, fragment, backslash, or '..'.`);
      else if (routePaths.has(route.path)) errors.push(`${label}.path duplicates '${route.path}'.`);
      else routePaths.add(route.path);

      if (route.file !== undefined && !validRelativeFile(route.file)) {
        errors.push(`${label}.file must be a relative file path inside outputDir.`);
      }
      checkStringArray(route.requiredText, `${label}.requiredText`, errors);

      if (route.expectedAnonymousStatuses !== undefined) {
        if (!Array.isArray(route.expectedAnonymousStatuses) || route.expectedAnonymousStatuses.length === 0) {
          errors.push(`${label}.expectedAnonymousStatuses must be a non-empty array when supplied.`);
        } else {
          const seenStatuses = new Set();
          route.expectedAnonymousStatuses.forEach((status, statusIndex) => {
            if (!Number.isInteger(status) || status < 100 || status > 599) {
              errors.push(`${label}.expectedAnonymousStatuses[${statusIndex}] must be an HTTP status from 100 to 599.`);
            } else if (seenStatuses.has(status)) {
              errors.push(`${label}.expectedAnonymousStatuses repeats ${status}.`);
            } else seenStatuses.add(status);
          });
        }
      }
    });
  }

  const viewports = config.browserViewports;
  if (!Array.isArray(viewports) || viewports.length === 0) {
    errors.push("browserViewports must be a non-empty array.");
  } else {
    const viewportKeys = new Set();
    for (const [index, viewport] of viewports.entries()) {
      const label = `browserViewports[${index}]`;
      if (!isObject(viewport)) {
        errors.push(`${label} must be an object.`);
        continue;
      }
      for (const dimension of ["width", "height"]) {
        if (!Number.isInteger(viewport[dimension]) || viewport[dimension] < 240 || viewport[dimension] > 10000) {
          errors.push(`${label}.${dimension} must be an integer from 240 to 10000.`);
        }
      }
      const key = `${viewport.width}x${viewport.height}`;
      if (viewportKeys.has(key)) errors.push(`${label} duplicates viewport ${key}.`);
      viewportKeys.add(key);
    }
    if (!viewports.some((item) => isObject(item) && item.width <= 480)) {
      errors.push("browserViewports must include a phone width at or below 480 px.");
    }
    if (!viewports.some((item) => isObject(item) && item.width >= 1024)) {
      errors.push("browserViewports must include a desktop width at or above 1024 px.");
    }
  }

  const flows = config.criticalFlows;
  const flowNames = new Set();
  const allStates = new Set();
  if (flows !== undefined && !Array.isArray(flows)) {
    errors.push("criticalFlows must be an array.");
  } else {
    for (const [index, flow] of (flows ?? []).entries()) {
      const label = `criticalFlows[${index}]`;
      if (!isObject(flow)) {
        errors.push(`${label} must be an object.`);
        continue;
      }
      if (!nonEmptyString(flow.name)) errors.push(`${label}.name must be a non-empty string.`);
      else if (flowNames.has(flow.name)) errors.push(`${label}.name duplicates '${flow.name}'.`);
      else flowNames.add(flow.name);
      const states = checkStringArray(flow.states, `${label}.states`, errors, { required: true });
      if (states.length === 0) errors.push(`${label}.states must name at least one observable state.`);
      const localStates = new Set();
      states.forEach((state) => {
        if (localStates.has(state)) errors.push(`${label}.states repeats '${state}'.`);
        localStates.add(state);
        allStates.add(state.toLowerCase());
      });
    }
  }

  if (config.siteType === "portal-internal" && config.accessMode === "public-anonymous") {
    errors.push("portal-internal contradicts accessMode 'public-anonymous'; use authenticated or internal.");
  }
  if (APP_SITE_TYPES.has(config.siteType) && (flows ?? []).length === 0) {
    errors.push(`${config.siteType} must define at least one critical flow.`);
  }
  if (STATEFUL_SITE_TYPES.has(config.siteType)) {
    const expectedStates = ["loading", "empty", "error", "success"];
    const missing = expectedStates.filter((state) => !allStates.has(state));
    if (missing.length > 0) warnings.push(`${config.siteType} criticalFlows do not yet cover: ${missing.join(", ")}.`);
  }

  if (Array.isArray(routes)) {
    for (const [index, route] of routes.entries()) {
      if (!isObject(route)) continue;
      const statuses = route.expectedAnonymousStatuses;
      if (config.accessMode === "public-anonymous" && Array.isArray(statuses)) {
        if (!statuses.includes(200)) errors.push(`routes[${index}] is public-anonymous but expectedAnonymousStatuses does not include 200.`);
        if (statuses.some((status) => status === 401 || status === 403)) {
          errors.push(`routes[${index}] is public-anonymous but expects an authentication status.`);
        }
      }
      if (config.accessMode !== "public-anonymous" && (!Array.isArray(statuses) || statuses.length === 0)) {
        errors.push(`routes[${index}] must define expectedAnonymousStatuses for ${config.accessMode} access.`);
      }
      if (config.accessMode !== "public-anonymous" && Array.isArray(statuses) && statuses.length === 1 && statuses[0] === 200) {
        warnings.push(`routes[${index}] expects anonymous 200; status alone cannot prove protected content is hidden.`);
      }
      if (config.renderMode === "ssr" && route.file !== undefined) {
        warnings.push(`routes[${index}].file is ignored by SSR deployment validation.`);
      }
    }
  }

  if (config.renderMode === "spa" && Array.isArray(routes)) {
    const files = new Set(routes.map((route) => route?.file).filter(nonEmptyString));
    if (files.size > 1) errors.push("SPA routes cannot declare multiple different HTML entry files; use static renderMode for a multipage export.");
  }

  if (["landing-page", "portfolio", "editorial-story"].includes(config.siteType)
      && Array.isArray(config.criticalAssets) && config.criticalAssets.length === 0) {
    warnings.push(`${config.siteType} has no criticalAssets; confirm the page is intentionally text-only.`);
  }

  return { errors, warnings };
}

export async function loadConfigFile(configInput, baseDirectory = process.cwd()) {
  const configPath = path.resolve(baseDirectory, configInput ?? "site-quality.config.json");
  let config;
  try {
    config = JSON.parse(await readFile(configPath, "utf8"));
  } catch (error) {
    throw new ConfigValidationError(`Cannot read config '${configPath}': ${error.message}`);
  }
  const result = validateConfigObject(config);
  return {
    config,
    configPath,
    configDirectory: path.dirname(configPath),
    outputRoot: nonEmptyString(config?.outputDir) ? path.resolve(path.dirname(configPath), config.outputDir) : null,
    ...result,
  };
}

async function runCli() {
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
    throw new ConfigValidationError(error.message);
  }
  const { values, positionals } = parsed;
  if (values.help) {
    console.log(usage.trim());
    return;
  }
  if (positionals.length > 1) throw new ConfigValidationError("Provide only one config path.");
  const result = await loadConfigFile(values.config ?? positionals[0]);

  if (values.json) {
    console.log(JSON.stringify({
      valid: result.errors.length === 0,
      configPath: result.configPath,
      siteType: result.config?.siteType,
      renderMode: result.config?.renderMode,
      accessMode: result.config?.accessMode,
      errors: result.errors,
      warnings: result.warnings,
    }, null, 2));
  } else {
    for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
    if (result.errors.length === 0) {
      console.log(`Configuration passed: ${result.configPath}`);
      console.log(`${result.config.siteType} · ${result.config.renderMode} · ${result.config.accessMode} · ${result.config.routes.length} route(s)`);
    }
  }

  if (result.errors.length > 0) {
    if (!values.json) {
      console.error(`Configuration failed with ${result.errors.length} problem(s):`);
      for (const error of result.errors) console.error(`- ${error}`);
    }
    process.exitCode = 1;
  }
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  runCli().catch((error) => {
    console.error(`Configuration error: ${error.message}`);
    console.error("Run with --help for usage.");
    process.exitCode = error instanceof ConfigValidationError ? 2 : 1;
  });
}
