// Keeps the tool links in src/data/tools/*.json alive.
//
//   1. Takes the current upstream URL of each tool from the BlackArch package database.
//   2. Resolves old Google Code projects through the Google Code archive, which
//      records where a project moved to.
//   3. Requests every URL, follows redirects and stores the final address when a
//      site moved permanently (for example a renamed GitHub repository).
//   4. Writes the tools whose link is gone to src/data/tool-dead-links.json.
//
// A link is "dead" only on a clear answer: HTTP 404/410, an unknown host or a
// refused connection. Timeouts, rate limits and bot blocks are left alone.
//
// Usage: node scripts/sync-tool-links.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { readTools } from "./lib/blackarch-db.mjs";

const TOOLS_DIR = new URL("../src/data/tools/", import.meta.url);
const DEAD_OUTPUT = new URL("../src/data/tool-dead-links.json", import.meta.url);
const CONCURRENCY = 24;
const TIMEOUT_MS = 20_000;
const MAX_REDIRECTS = 6;
const HEADERS = { "User-Agent": "Mozilla/5.0 (compatible; link-checker)", Accept: "*/*" };
const DEAD_ERRORS = new Set(["ENOTFOUND", "ECONNREFUSED", "EAI_AGAIN"]);

const host = (url) => new URL(url).host.replace(/^www\./, "").toLowerCase();

/** Runs `worker` over `items` with a fixed number of parallel requests. */
async function mapPool(items, worker) {
  const results = Array.from({ length: items.length });
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await worker(items[i]);
      }
    }),
  );
  return results;
}

async function request(url, method) {
  const response = await fetch(url, {
    method,
    headers: HEADERS,
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  response.body?.cancel().catch(() => {});
  return response;
}

/**
 * Follows the redirect chain of `url`.
 * @returns {Promise<{state: "ok"|"dead"|"unknown", final: string, permanent: boolean}>}
 */
async function check(url) {
  let current = url;
  let permanent = true; // stays true only while every hop is a 301/308
  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      let response = await request(current, "HEAD");
      // Some servers reject HEAD; ask again with GET before judging.
      if ([400, 403, 404, 405, 501].includes(response.status))
        response = await request(current, "GET");

      if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
        if (![301, 308].includes(response.status)) permanent = false;
        current = new URL(response.headers.get("location"), current).href;
        continue;
      }
      if (response.ok)
        return { state: "ok", final: current, permanent: permanent && current !== url };
      if ([404, 410].includes(response.status))
        return { state: "dead", final: current, permanent: false };
      return { state: "unknown", final: current, permanent: false };
    }
  } catch (error) {
    const code = error.cause?.code ?? error.code;
    return { state: DEAD_ERRORS.has(code) ? "dead" : "unknown", final: current, permanent: false };
  }
  return { state: "unknown", final: current, permanent: false };
}

/** Where a Google Code project lives now: its new home, or its page in the archive. */
async function resolveGoogleCode(url) {
  const project = url.match(/code\.google\.com\/p\/([\w.-]+)/i)?.[1];
  if (!project) return null;
  try {
    const record = await fetch(
      `https://storage.googleapis.com/google-code-archive/v2/code.google.com/${project}/project.json`,
      { signal: AbortSignal.timeout(TIMEOUT_MS) },
    );
    if (!record.ok) return null;
    const { movedTo } = await record.json();
    return movedTo
      ? movedTo.replace(/^http:/, "https:")
      : `https://code.google.com/archive/p/${project}`;
  } catch {
    return null;
  }
}

/**
 * A permanent redirect is trusted when it stays on the same site (http to
 * https, renamed GitHub repository). Redirects to another site are often
 * parked domains, so the original link is kept.
 */
const isTrustedMove = (from, to) => host(from) === host(to);

// --- Load ---------------------------------------------------------------
const files = readdirSync(TOOLS_DIR).filter((file) => file.endsWith(".json"));
const lists = new Map(
  files.map((file) => [file, JSON.parse(readFileSync(new URL(file, TOOLS_DIR), "utf8"))]),
);
const tools = [...lists.values()].flat();
const stats = { fromDatabase: 0, googleCode: 0, redirected: 0 };

// --- 1. Package database ------------------------------------------------
const database = await readTools();
for (const tool of tools) {
  const upstream = database.get(tool.name)?.url;
  if (upstream && upstream !== tool.url) {
    tool.url = upstream;
    stats.fromDatabase++;
  }
}

// --- 2. Google Code -----------------------------------------------------
const googleCodeUrls = [
  ...new Set(tools.map((t) => t.url).filter((u) => /code\.google\.com\/p\//i.test(u ?? ""))),
];
const googleCodeHomes = new Map(
  (await mapPool(googleCodeUrls, resolveGoogleCode)).map((home, i) => [googleCodeUrls[i], home]),
);
for (const tool of tools) {
  const home = googleCodeHomes.get(tool.url);
  if (home) {
    tool.url = home;
    stats.googleCode++;
  }
}

// --- 3. Check every link ------------------------------------------------
const urls = [...new Set(tools.map((t) => t.url).filter((u) => /^https?:\/\//.test(u ?? "")))];
console.log(`Checking ${urls.length} links...`);
const results = new Map((await mapPool(urls, check)).map((result, i) => [urls[i], result]));

// One retry for dead links, so a short outage is not reported as a dead site.
const firstDead = urls.filter((url) => results.get(url).state === "dead");
(await mapPool(firstDead, check)).forEach((result, i) => results.set(firstDead[i], result));

const dead = [];
for (const tool of tools) {
  const result = results.get(tool.url);
  if (!result) continue;
  if (result.state === "dead") dead.push(tool.name);
  else if (result.permanent && isTrustedMove(tool.url, result.final)) {
    tool.url = result.final;
    stats.redirected++;
  }
}

// --- Write --------------------------------------------------------------
for (const [file, list] of lists) {
  writeFileSync(new URL(file, TOOLS_DIR), JSON.stringify(list, null, 2) + "\n");
}
const deadNames = [...new Set(dead)].sort();
writeFileSync(DEAD_OUTPUT, JSON.stringify(deadNames, null, 2) + "\n");

const states = [...results.values()].reduce(
  (n, r) => ({ ...n, [r.state]: (n[r.state] ?? 0) + 1 }),
  {},
);
console.log(
  `Links: ${states.ok ?? 0} ok, ${states.dead ?? 0} dead, ${states.unknown ?? 0} not verifiable`,
);
console.log(
  `Updated: ${stats.fromDatabase} from the package database, ${stats.googleCode} Google Code projects, ${stats.redirected} permanent redirects`,
);
console.log(`${deadNames.length} tools with a dead link -> src/data/tool-dead-links.json`);
