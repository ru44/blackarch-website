// Reads the official BlackArch package database (the file pacman syncs).
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DATABASE = "https://blackarch.org/blackarch/blackarch/os/x86_64/blackarch.db";

/** Reads one `%FIELD%` block of a pacman `desc` file as a list of lines. */
function field(desc, name) {
  const match = desc.match(new RegExp(`%${name}%\\n([\\s\\S]*?)(?:\\n\\n|$)`));
  return match ? match[1].split("\n") : [];
}

/**
 * Downloads and parses the database (needs `tar`).
 * Returns every package in the `blackarch` group, i.e. the tools; the
 * repository also carries libraries and helpers that are not listed.
 *
 * @returns {Promise<Map<string, {version: string, url: string, groups: string[], buildDate: string}>>}
 */
export async function readTools() {
  const dir = mkdtempSync(join(tmpdir(), "ba-db-"));
  try {
    const archive = join(dir, "blackarch.db");
    writeFileSync(archive, Buffer.from(await (await fetch(DATABASE)).arrayBuffer()));
    execFileSync("tar", ["-xf", archive, "-C", dir]);

    const tools = new Map();
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const desc = readFileSync(join(dir, entry.name, "desc"), "utf8");
      const groups = field(desc, "GROUPS");
      if (!groups.includes("blackarch")) continue;
      tools.set(field(desc, "NAME")[0], {
        version: field(desc, "VERSION")[0],
        url: field(desc, "URL")[0] ?? "",
        groups,
        buildDate: new Date(Number(field(desc, "BUILDDATE")[0]) * 1000).toISOString().slice(0, 10),
      });
    }
    return tools;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
