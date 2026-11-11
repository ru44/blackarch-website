// Rebuilds the tools list in src/data/tools/ from the official BlackArch
// package database: new tools appear, removed tools disappear, and versions,
// descriptions, groups and build dates are brought up to date.
//
// One file is written per category (the tool's first blackarch-<category>
// group), so the Tools page can load them in parallel:
//   [{ name, version, description, url, groups: ["webapp", ...], updated: "YYYY-MM-DD" }]
//
// Usage: node scripts/sync-tools.mjs   (needs `tar`)
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { readTools } from "./lib/blackarch-db.mjs";

const TOOLS_DIR = new URL("../src/data/tools/", import.meta.url);
// Where a tool's website moved to, as recorded by sync-tool-links.mjs.
const REDIRECTS_FILE = new URL("../src/data/tool-link-redirects.json", import.meta.url);
const UNCATEGORIZED = "uncategorized";

// "1.2.3-4" is upstream version 1.2.3, package release 4; "1:2.0-1" has an epoch.
const upstreamVersion = (version) => version.replace(/^\d+:/, "").replace(/-[^-]+$/, "");

const database = await readTools();
// A partial download must never wipe the list.
if (database.size < 1000)
  throw new Error(`Only ${database.size} tools found; refusing to continue.`);

const redirects = existsSync(REDIRECTS_FILE)
  ? JSON.parse(readFileSync(REDIRECTS_FILE, "utf8"))
  : {};
const previous = new Set(
  existsSync(TOOLS_DIR)
    ? readdirSync(TOOLS_DIR)
        .filter((file) => file.endsWith(".json"))
        .flatMap((file) => JSON.parse(readFileSync(new URL(file, TOOLS_DIR), "utf8")))
        .map((tool) => tool.name)
    : [],
);

const categories = new Map();
for (const [name, tool] of [...database].sort(([a], [b]) => (a < b ? -1 : 1))) {
  const groups = tool.groups
    .filter((group) => group.startsWith("blackarch-"))
    .map((group) => group.slice("blackarch-".length));
  const category = groups[0] ?? UNCATEGORIZED;
  if (!categories.has(category)) categories.set(category, []);
  categories.get(category).push({
    name,
    version: upstreamVersion(tool.version),
    description: tool.description,
    url: redirects[tool.url] ?? tool.url,
    groups,
    updated: tool.buildDate,
  });
}

mkdirSync(TOOLS_DIR, { recursive: true });
for (const file of readdirSync(TOOLS_DIR).filter((name) => name.endsWith(".json"))) {
  if (!categories.has(file.slice(0, -".json".length))) rmSync(new URL(file, TOOLS_DIR));
}
for (const [category, tools] of categories) {
  writeFileSync(new URL(`${category}.json`, TOOLS_DIR), JSON.stringify(tools, null, 2) + "\n");
}

const added = [...database.keys()].filter((name) => !previous.has(name));
const removed = [...previous].filter((name) => !database.has(name));
console.log(`${database.size} tools in ${categories.size} categories -> src/data/tools/`);
console.log(`${added.length} added, ${removed.length} removed`);
