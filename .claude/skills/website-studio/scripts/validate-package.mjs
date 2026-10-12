#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateConfigObject } from "./validate-config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "SKILL.md", "README.md", "LICENSE", "THIRD_PARTY.md", "package.json",
  "references/capability-routing.md", "references/discovery.md", "references/design-choice-flow.md",
  "references/design-quality.md", "references/content-and-ux.md", "references/implementation.md",
  "references/responsive-accessibility.md", "references/security-and-privacy.md",
  "references/source-and-rights.md", "references/qa-and-release.md", "references/hosting-handoff.md",
  "recipes/landing-page.md", "recipes/portfolio.md", "recipes/editorial-story.md",
  "recipes/knowledge-hub.md", "recipes/directory-catalog.md", "recipes/dashboard.md",
  "recipes/portal-internal-tool.md", "recipes/tracker-workflow.md",
  "recipes/capability-data.md", "recipes/capability-auth.md", "recipes/capability-uploads.md",
  "recipes/capability-connectors.md",
  "adapters/sites.md", "adapters/existing-project.md", "adapters/static.md", "adapters/generic-framework.md",
  "assets/website-brief.template.md", "assets/design-decision.template.md",
  "assets/capability-matrix.template.json", "assets/route-matrix.example.csv",
  "assets/flow-state-matrix.example.csv", "assets/permission-matrix.example.csv",
  "assets/semantic-tokens.css", "assets/marketing-shell.html", "assets/content-shell.html",
  "assets/app-shell.html", "assets/media-manifest.example.json", "assets/source-ledger.example.csv",
  "assets/site-quality.config.example.json",
  "scripts/inspect-project.mjs", "scripts/validate-config.mjs", "scripts/validate-export.mjs",
  "scripts/validate-deployment.mjs", "scripts/audit-media.mjs", "scripts/validate-package.mjs",
  "scripts/package-release.mjs", "agents/openai.yaml", "assets/website-studio-icon.svg",
  "assets/website-studio-logo.svg", "docs/agent-setup.md", "docs/troubleshooting.md", "CHANGELOG.md",
  "examples/launch-site/index.html", "examples/launch-site/site-quality.config.json",
  "examples/dashboard/index.html", "examples/dashboard/site-quality.config.json",
  "examples/editorial-story/index.html", "examples/editorial-story/site-quality.config.json",
  "tests/routing-cases.json", "tests/validators.test.mjs",
];

const failures = [];
for (const relative of requiredFiles) {
  try { await access(path.join(root, relative)); }
  catch { failures.push(`Missing required file: ${relative}`); }
}

const skill = await readFile(path.join(root, "SKILL.md"), "utf8");
const skillLines = skill.trimEnd().split(/\r?\n/).length;
if (skillLines > 100) failures.push(`SKILL.md must stay under 100 lines; found ${skillLines}`);
if (!/^---\n[\s\S]+?\n---\n/.test(skill)) failures.push("SKILL.md needs YAML frontmatter");
if (!/^name:\s*website-studio\s*$/m.test(skill)) failures.push("SKILL.md name must match the directory");
if (!/^description:\s*.+Use when\s+/m.test(skill)) failures.push("SKILL.md description needs concrete 'Use when' triggers");

const designDecision = await readFile(path.join(root, "assets/design-decision.template.md"), "utf8");
for (const option of ["Option A", "Option B", "Option C"]) {
  if (!designDecision.includes(option)) failures.push(`Design decision template is missing ${option}`);
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && [".git", "node_modules", "dist"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

const allFiles = await walk(root);
const forbiddenBinary = /\.(?:jpe?g|png|gif|webp|avif|mp[34]|wav|flac|woff2?|ttf|otf)$/i;
for (const file of allFiles) {
  const relative = path.relative(root, file);
  if (forbiddenBinary.test(file)) failures.push(`Portable package must not bundle binary media: ${relative}`);
  if (!/\.(?:md|mjs|json|csv|css|html|svg)$/i.test(file)) continue;
  const content = await readFile(file, "utf8");
  if (/\/Users\/|[A-Z]:\\Users\\/i.test(content)) failures.push(`Machine-specific path found in ${relative}`);
  if (file.endsWith(".md")) {
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const raw = match[1].trim().replace(/^<|>$/g, "");
      if (!raw || /^(?:https?:|mailto:|#)/i.test(raw)) continue;
      const target = decodeURIComponent(raw.split("#")[0]);
      try { await access(path.resolve(path.dirname(file), target)); }
      catch { failures.push(`Broken Markdown link in ${relative}: ${raw}`); }
    }
  }
}

for (const name of ["launch-site", "dashboard", "editorial-story"]) {
  const html = await readFile(path.join(root, `examples/${name}/index.html`), "utf8");
  const cssAndHtml = html;
  if ((html.match(/<h1\b/gi) ?? []).length !== 1) failures.push(`${name} must contain exactly one <h1>`);
  if (!/class="(?:[^"]*\s)?skip(?:\s[^"]*)?"/.test(html)) failures.push(`${name} must contain a skip link`);
  if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(cssAndHtml)) failures.push(`${name} must support reduced motion`);
  const config = JSON.parse(await readFile(path.join(root, `examples/${name}/site-quality.config.json`), "utf8"));
  const result = validateConfigObject(config);
  if (result.errors.length) failures.push(`${name} config: ${result.errors.join(" ")}`);
}

if (failures.length) {
  console.error("Website Studio package validation failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Website Studio package passed: ${requiredFiles.length} required files, ${skillLines}-line SKILL.md, 3 valid examples, no bundled binary media.`);
