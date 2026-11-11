// Rebuilds the tool package-group data from the BlackArch wiki repository.
//   src/data/tool-groups.json  { toolName: ["blackarch-webapp", ...] }
//   src/data/tool-docs.json    [toolName, ...] for tools with a full wiki page
// Usage: node scripts/sync-wiki-groups.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO = "https://github.com/anunna/blackarch-wiki.git";
const DATA = new URL("../src/data/", import.meta.url);

/** Parses the simple `key: value` frontmatter used by the wiki. */
function frontmatter(file) {
  const match = readFileSync(file, "utf8").match(/^---\n(.*?)\n---/s);
  if (!match) return null;
  return Object.fromEntries(
    match[1]
      .split("\n")
      .filter((line) => line.includes(":"))
      .map((line) => {
        const [key, ...value] = line.split(":");
        return [key.trim(), value.join(":").trim()];
      }),
  );
}

const groupsOf = (fm) =>
  (fm.group ?? "").split(/\s+/).filter((group) => /^blackarch[a-z0-9-]*$/.test(group));

const dir = mkdtempSync(join(tmpdir(), "ba-wiki-"));
try {
  execFileSync("git", ["clone", "--depth", "1", "--quiet", REPO, dir], { stdio: "inherit" });

  const groups = {};
  const collect = (folder) => {
    for (const file of readdirSync(join(dir, folder)).filter((f) => f.endsWith(".md"))) {
      const fm = frontmatter(join(dir, folder, file));
      if (!fm) continue;
      const name = fm.name || file.slice(0, -3);
      const found = groupsOf(fm);
      if (found.length) groups[name] = [...new Set([...(groups[name] ?? []), ...found])].sort();
    }
  };
  collect("prep"); // one stub per package
  collect("tools"); // full pages can list more groups

  const docs = readdirSync(join(dir, "tools"))
    .filter((f) => /^[A-Za-z0-9._+-]+\.md$/.test(f))
    .map((f) => f.slice(0, -3))
    .sort();

  const sorted = Object.fromEntries(Object.entries(groups).sort(([a], [b]) => (a < b ? -1 : 1)));
  writeFileSync(new URL("tool-groups.json", DATA), JSON.stringify(sorted));
  writeFileSync(new URL("tool-docs.json", DATA), JSON.stringify(docs));
  console.log(`${Object.keys(sorted).length} tools with groups, ${docs.length} wiki pages`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
