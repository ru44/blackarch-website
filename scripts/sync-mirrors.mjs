// Rebuilds src/data/mirrors.json from the official list on blackarch.org.
// Usage: node scripts/sync-mirrors.mjs
import { writeFileSync } from "node:fs";

const SOURCE = "https://blackarch.org/downloads.html";
const OUTPUT = new URL("../src/data/mirrors.json", import.meta.url);

const decode = (text) => text.replaceAll("&amp;", "&");
// The links end up as hrefs on the site, so only real mirror protocols are accepted.
const MIRROR_URL = /^(https?|ftp|ftpes|rsync|gopher):\/\//i;

const html = await (await fetch(SOURCE)).text();
const start = html.indexOf("id=mirror-list");
if (start === -1) throw new Error("Mirror list not found; has the page layout changed?");

// The list is a run of `<img alt="Country">` headings, each followed by links.
// Commented-out blocks (e.g. "World Wide") are ignored.
let section = html.slice(start, html.indexOf("</ul>", html.indexOf("list-group-item", start)));
// Repeat until nothing changes: removing one comment can join the text around
// it into a new comment marker.
for (let previous; previous !== section; ) {
  previous = section;
  section = section.replace(/<!--.*?-->/gs, "");
}

const mirrors = {};
let country;
for (const match of section.matchAll(/<img[^>]*alt="([^"]+)"[^>]*\/>|<a href="([^"]+)"/g)) {
  if (match[1]) {
    country = decode(match[1]);
    mirrors[country] ??= [];
  } else if (country && MIRROR_URL.test(match[2]) && /blackarch/i.test(match[2])) {
    // The official page also lists an unrelated OPNsense path; require "blackarch".
    mirrors[country].push(decode(match[2]));
  }
}

writeFileSync(OUTPUT, JSON.stringify(mirrors, null, 2) + "\n");
const total = Object.values(mirrors).reduce((sum, urls) => sum + urls.length, 0);
console.log(`${Object.keys(mirrors).length} countries, ${total} mirrors -> src/data/mirrors.json`);
