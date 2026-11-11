// Rebuilds src/data/mirrors.json from the official list on blackarch.org.
// Usage: node scripts/sync-mirrors.mjs
import { writeFileSync } from "node:fs";

const SOURCE = "https://blackarch.org/downloads.html";
const OUTPUT = new URL("../src/data/mirrors.json", import.meta.url);

const decode = (text) => text.replaceAll("&amp;", "&");

const html = await (await fetch(SOURCE)).text();
const start = html.indexOf("id=mirror-list");
if (start === -1) throw new Error("Mirror list not found; has the page layout changed?");

// The list is a run of `<img alt="Country">` headings, each followed by links.
// Commented-out blocks (e.g. "World Wide") are ignored.
const section = html
  .slice(start, html.indexOf("</ul>", html.indexOf("list-group-item", start)))
  .replace(/<!--.*?-->/gs, "");

const mirrors = {};
let country;
for (const match of section.matchAll(/<img[^>]*alt="([^"]+)"[^>]*\/>|<a href="([^"]+)"/g)) {
  if (match[1]) {
    country = decode(match[1]);
    mirrors[country] ??= [];
  } else if (country && /blackarch/i.test(match[2])) {
    // The official page also lists an unrelated OPNsense path; require "blackarch".
    mirrors[country].push(decode(match[2]));
  }
}

writeFileSync(OUTPUT, JSON.stringify(mirrors, null, 2) + "\n");
const total = Object.values(mirrors).reduce((sum, urls) => sum + urls.length, 0);
console.log(`${Object.keys(mirrors).length} countries, ${total} mirrors -> src/data/mirrors.json`);
