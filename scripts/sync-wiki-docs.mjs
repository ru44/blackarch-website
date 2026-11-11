// Rebuilds src/data/tool-docs.json: the tools that have a page on the
// BlackArch wiki (https://blackarch.wiki), so the Tools page can link to it.
//   ["0d1n", "0trace", ...]
// Usage: node scripts/sync-wiki-docs.mjs
import { writeFileSync } from "node:fs";

const LISTING = "https://api.github.com/repos/anunna/blackarch-wiki/contents/tools";
const OUTPUT = new URL("../src/data/tool-docs.json", import.meta.url);

const headers = { Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const response = await fetch(LISTING, { headers });
if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

const docs = (await response.json())
  .map((entry) => entry.name)
  .filter((name) => /^[A-Za-z0-9._+-]+\.md$/.test(name))
  .map((name) => name.slice(0, -".md".length))
  .sort();

writeFileSync(OUTPUT, JSON.stringify(docs) + "\n");
console.log(`${docs.length} wiki pages -> src/data/tool-docs.json`);
