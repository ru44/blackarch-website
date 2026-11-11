// Rebuilds src/data/tool-updates.json: the last build date of every BlackArch
// tool, read from the official package database.
//   { toolName: "YYYY-MM-DD" }
// Usage: node scripts/sync-tool-updates.mjs   (needs `tar`)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DATABASE = "https://blackarch.org/blackarch/blackarch/os/x86_64/blackarch.db";
const OUTPUT = new URL("../src/data/tool-updates.json", import.meta.url);

/** Reads one `%FIELD%` block of a pacman `desc` file as a list of lines. */
function field(desc, name) {
  const match = desc.match(new RegExp(`%${name}%\\n([\\s\\S]*?)(?:\\n\\n|$)`));
  return match ? match[1].split("\n") : [];
}

const dir = mkdtempSync(join(tmpdir(), "ba-db-"));
try {
  const archive = join(dir, "blackarch.db");
  writeFileSync(archive, Buffer.from(await (await fetch(DATABASE)).arrayBuffer()));
  execFileSync("tar", ["-xf", archive, "-C", dir]);

  const updates = {};
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const desc = readFileSync(join(dir, entry.name, "desc"), "utf8");
    // The repository also carries libraries and helpers; tools are in the `blackarch` group.
    if (!field(desc, "GROUPS").includes("blackarch")) continue;
    const [name] = field(desc, "NAME");
    const [buildDate] = field(desc, "BUILDDATE");
    updates[name] = new Date(Number(buildDate) * 1000).toISOString().slice(0, 10);
  }

  const sorted = Object.fromEntries(Object.entries(updates).sort(([a], [b]) => (a < b ? -1 : 1)));
  writeFileSync(OUTPUT, JSON.stringify(sorted));
  console.log(`${Object.keys(sorted).length} tools -> src/data/tool-updates.json`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
