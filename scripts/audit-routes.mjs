import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const registryPath = path.join(rootDir, "src", "features", "tools", "toolsRegistry.js");
const appPath = path.join(rootDir, "src", "App.jsx");
const sitemapPath = path.join(rootDir, "public", "sitemap.xml");

const { toolsRegistry, CATEGORIES } = await import(pathToFileURL(registryPath).href);

const appSource = fs.readFileSync(appPath, "utf8");
const sitemapSource = fs.readFileSync(sitemapPath, "utf8");

const requiredFields = [
  "id",
  "category",
  "title",
  "description",
  "path",
  "status",
  "tags",
  "isPopular",
  "image",
  "icon",
  "accentColor",
  "relatedToolIds",
];

const domain = "https://tools.jonascode.com";
const errors = [];
const warnings = [];

function addError(message) {
  errors.push(`ERROR: ${message}`);
}

function addWarning(message) {
  warnings.push(`WARN: ${message}`);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const toolsById = new Map();
const paths = new Map();

for (const tool of toolsRegistry) {
  for (const field of requiredFields) {
    if (!(field in tool)) {
      addError(`${tool.id || "unknown tool"} is missing required field "${field}".`);
    }
  }

  if (!isNonEmptyString(tool.id)) {
    addError("A tool has an empty or invalid id.");
    continue;
  }

  if (toolsById.has(tool.id)) {
    addError(`Duplicate tool id "${tool.id}".`);
  }

  toolsById.set(tool.id, tool);

  if (!isNonEmptyString(tool.path)) {
    addError(`${tool.id} has an empty or invalid path.`);
  } else {
    if (paths.has(tool.path)) {
      addError(`Duplicate tool path "${tool.path}" used by "${paths.get(tool.path)}" and "${tool.id}".`);
    }

    paths.set(tool.path, tool.id);

    const expectedPath = `/tools/${tool.id}`;
    if (tool.path !== expectedPath) {
      addError(`${tool.id} path should be "${expectedPath}" but is "${tool.path}".`);
    }
  }

  if (!CATEGORIES.includes(tool.category)) {
    addError(`${tool.id} uses unknown category "${tool.category}".`);
  }

  if (!Array.isArray(tool.tags) || tool.tags.length === 0) {
    addError(`${tool.id} must have at least one tag.`);
  }

  if (!Array.isArray(tool.relatedToolIds)) {
    addError(`${tool.id} relatedToolIds must be an array.`);
  }

  if (tool.status !== "live" && tool.status !== "coming-soon") {
    addError(`${tool.id} has invalid status "${tool.status}".`);
  }
}

for (const tool of toolsRegistry) {
  if (!Array.isArray(tool.relatedToolIds)) continue;

  const seenRelated = new Set();

  for (const relatedId of tool.relatedToolIds) {
    if (relatedId === tool.id) {
      addError(`${tool.id} cannot relate to itself.`);
    }

    if (seenRelated.has(relatedId)) {
      addError(`${tool.id} has duplicate relatedToolId "${relatedId}".`);
    }

    seenRelated.add(relatedId);

    if (!toolsById.has(relatedId)) {
      addError(`${tool.id} references missing relatedToolId "${relatedId}".`);
    }
  }
}

const liveTools = toolsRegistry.filter((tool) => tool.status === "live");

for (const tool of liveTools) {
  if (!appSource.includes(`path="${tool.path}"`)) {
    addError(`${tool.id} is live but missing route path "${tool.path}" in src/App.jsx.`);
  }

  const sitemapUrl = `${domain}${tool.path}`;
  if (!sitemapSource.includes(`<loc>${sitemapUrl}</loc>`)) {
    addError(`${tool.id} is live but missing sitemap URL "${sitemapUrl}".`);
  }

  if (tool.relatedToolIds.length === 0) {
    addWarning(`${tool.id} is live but has no related tools.`);
  }
}

console.log("QUESTPAUSE Tools route audit");
console.log("--------------------------------");
console.log(`Tools checked: ${toolsRegistry.length}`);
console.log(`Live tools: ${liveTools.length}`);
console.log(`Categories: ${CATEGORIES.length}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

for (const warning of warnings) {
  console.warn(warning);
}

for (const error of errors) {
  console.error(error);
}

if (errors.length > 0) {
  process.exit(1);
}

console.log("Route audit passed.");
