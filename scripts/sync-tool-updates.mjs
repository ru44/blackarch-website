// Rebuilds src/data/tool-updates.json: the last build date of every BlackArch
// tool, read from the official package database.
//   { toolName: "YYYY-MM-DD" }
// Usage: node scripts/sync-tool-updates.mjs
import { writeFileSync } from "node:fs";
import { readTools } from "./lib/blackarch-db.mjs";

const OUTPUT = new URL("../src/data/tool-updates.json", import.meta.url);

const tools = await readTools();
const updates = Object.fromEntries(
  [...tools].map(([name, tool]) => [name, tool.buildDate]).sort(([a], [b]) => (a < b ? -1 : 1)),
);

writeFileSync(OUTPUT, JSON.stringify(updates));
console.log(`${tools.size} tools -> src/data/tool-updates.json`);
