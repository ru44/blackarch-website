// Rebuilds src/data/tool-stars.json: the GitHub stars of each tool's upstream
// repository, most starred first.
//   { toolName: 12345, ... }
// Tools hosted outside GitHub, or whose repository no longer exists, are left out.
//
// Usage: GITHUB_TOKEN=... node scripts/sync-tool-stars.mjs
//        (without GITHUB_TOKEN the token of the `gh` CLI is used)
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const TOOLS_DIR = new URL("../src/data/tools/", import.meta.url);
const OUTPUT = new URL("../src/data/tool-stars.json", import.meta.url);
const BATCH = 100; // repositories per GraphQL request

const token =
  process.env.GITHUB_TOKEN || execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim();

// tool name -> "owner/repo"
const repos = new Map();
for (const file of readdirSync(TOOLS_DIR).filter((f) => f.endsWith(".json"))) {
  for (const tool of JSON.parse(readFileSync(new URL(file, TOOLS_DIR), "utf8"))) {
    const match = tool.url?.match(/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/#?]|$)/i);
    if (match && !repos.has(tool.name)) repos.set(tool.name, `${match[1]}/${match[2]}`);
  }
}

async function starsFor(slugs) {
  const query = `query {${slugs
    .map((slug, i) => {
      const [owner, name] = slug.split("/");
      return `r${i}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { stargazerCount }`;
    })
    .join("\n")}}`;
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
  // Renamed or deleted repositories come back as null with an entry in `errors`.
  const { data } = await response.json();
  return slugs.map((_, i) => data?.[`r${i}`]?.stargazerCount ?? null);
}

const slugs = [...new Set(repos.values())];
const stars = new Map();
for (let i = 0; i < slugs.length; i += BATCH) {
  const batch = slugs.slice(i, i + BATCH);
  (await starsFor(batch)).forEach((count, n) => count !== null && stars.set(batch[n], count));
}

const ranked = [...repos]
  .filter(([, slug]) => stars.has(slug))
  .map(([name, slug]) => [name, stars.get(slug)])
  .sort(([nameA, a], [nameB, b]) => b - a || (nameA < nameB ? -1 : 1));

writeFileSync(OUTPUT, JSON.stringify(Object.fromEntries(ranked)));
console.log(
  `${repos.size} tools link to GitHub, ${ranked.length} have stars -> src/data/tool-stars.json`,
);
