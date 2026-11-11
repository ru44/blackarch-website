// Updates the version of every tool in src/data/tools/*.json from the official
// BlackArch package database. Tools that are no longer in the database keep
// their last known version.
// Usage: node scripts/sync-tool-versions.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { readTools } from "./lib/blackarch-db.mjs";

const TOOLS_DIR = new URL("../src/data/tools/", import.meta.url);

// "1.2.3-4" is upstream version 1.2.3, package release 4; "1:2.0-1" has an epoch.
const upstreamVersion = (version) => version.replace(/^\d+:/, "").replace(/-[^-]+$/, "");

const database = await readTools();
let updated = 0;
let missing = 0;

for (const file of readdirSync(TOOLS_DIR).filter((name) => name.endsWith(".json"))) {
  const url = new URL(file, TOOLS_DIR);
  const tools = JSON.parse(readFileSync(url, "utf8"));
  for (const tool of tools) {
    const current = database.get(tool.name);
    if (!current) {
      missing++;
      continue;
    }
    const version = upstreamVersion(current.version);
    if (version !== tool.version) {
      tool.version = version;
      updated++;
    }
  }
  writeFileSync(url, JSON.stringify(tools, null, 2) + "\n");
}

console.log(`${updated} versions updated, ${missing} tools not in the database (kept as they are)`);
