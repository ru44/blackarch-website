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
// refused connection. When a site cannot be checked (timeout, rate limit, bot
// block) the tool keeps the link and the dead/alive state it had before, so a
// bad network day never loses information.
//
// GitHub repositories are checked through the GitHub API when a token is
// available, because GitHub throttles plain requests from CI.
//
// Usage: node scripts/sync-tool-links.mjs
//        (uses GITHUB_TOKEN, or the token of the `gh` CLI, when present)
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { readTools } from "./lib/blackarch-db.mjs";

const TOOLS_DIR = new URL("../src/data/tools/", import.meta.url);
const DEAD_OUTPUT = new URL("../src/data/tool-dead-links.json", import.meta.url);
// Remembers where an upstream URL moved to: { "url in the database": "final url" }.
const REDIRECTS_FILE = new URL("../src/data/tool-link-redirects.json", import.meta.url);
const CONCURRENCY = 24;
const TIMEOUT_MS = 20_000;
const MAX_REDIRECTS = 6;
const HEADERS = { "User-Agent": "Mozilla/5.0 (compatible; link-checker)", Accept: "*/*" };
const DEAD_ERRORS = new Set(["ENOTFOUND", "ECONNREFUSED", "EAI_AGAIN"]);

const host = (url) => new URL(url).host.replace(/^www\./, "").toLowerCase();
const readJson = (url, fallback) =>
  existsSync(url) ? JSON.parse(readFileSync(url, "utf8")) : fallback;

function githubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

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

/**
 * Checks GitHub repository URLs ("https://github.com/owner/repo") through the
 * API: a missing repository is dead, a renamed one reports its new name.
 * @returns {Promise<Map<string, {state: string, final: string, permanent: boolean}>>}
 */
async function checkGithubRepos(urls, token) {
  const results = new Map();
  const slug = (url) => url.match(/^https?:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i);
  const repos = urls.filter(slug);
  for (let i = 0; i < repos.length; i += 100) {
    const batch = repos.slice(i, i + 100);
    const query = `query {${batch
      .map((url, n) => {
        const [, owner, name] = slug(url);
        return `r${n}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { nameWithOwner }`;
      })
      .join("\n")}}`;
    let body;
    try {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(TIMEOUT_MS * 2),
      });
      if (!response.ok) continue; // leave this batch to the plain HTTP check
      body = await response.json();
    } catch {
      continue;
    }
    const notFound = new Set(
      (body.errors ?? [])
        .filter((error) => error.type === "NOT_FOUND")
        .map((error) => error.path?.[0]),
    );
    batch.forEach((url, n) => {
      const found = body.data?.[`r${n}`]?.nameWithOwner;
      if (found) {
        // The canonical address: current owner/name, https, no ".git" or trailing slash.
        const final = `https://github.com/${found}`;
        const moved = url.toLowerCase() !== final.toLowerCase();
        results.set(url, { state: "ok", final: moved ? final : url, permanent: moved });
      } else if (notFound.has(`r${n}`)) {
        results.set(url, { state: "dead", final: url, permanent: false });
      }
    });
  }
  return results;
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
const previousUrl = new Map(tools.map((tool) => [tool, tool.url]));
const previouslyDead = new Set(readJson(DEAD_OUTPUT, []));
const redirects = readJson(REDIRECTS_FILE, {});

// --- 1. Package database ------------------------------------------------
const database = await readTools();
for (const tool of tools) {
  const upstream = database.get(tool.name)?.url;
  // A URL that a previous run already followed to its new address is not "changed".
  if (upstream && upstream !== tool.url && redirects[upstream] !== tool.url) {
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
const token = githubToken();
const results = token ? await checkGithubRepos(urls, token) : new Map();
const viaHttp = urls.filter((url) => !results.has(url));
console.log(`  ${results.size} through the GitHub API, ${viaHttp.length} over HTTP`);
(await mapPool(viaHttp, check)).forEach((result, i) => results.set(viaHttp[i], result));

// One retry for dead links, so a short outage is not reported as a dead site.
const firstDead = viaHttp.filter((url) => results.get(url).state === "dead");
(await mapPool(firstDead, check)).forEach((result, i) => results.set(firstDead[i], result));

const dead = [];
for (const tool of tools) {
  const source = tool.url;
  const result = results.get(source);
  if (!result) continue;

  if (result.state === "unknown") {
    // Could not be checked this time: keep the link and state we had.
    tool.url = redirects[source] ?? previousUrl.get(tool);
    if (previouslyDead.has(tool.name)) dead.push(tool.name);
    continue;
  }
  if (result.state === "dead") {
    dead.push(tool.name);
    delete redirects[source];
  } else if (result.permanent && isTrustedMove(source, result.final)) {
    tool.url = result.final;
    redirects[source] = result.final;
    if (previousUrl.get(tool) !== result.final) stats.redirected++;
  } else {
    delete redirects[source];
  }
}

// --- Write --------------------------------------------------------------
for (const [file, list] of lists) {
  writeFileSync(new URL(file, TOOLS_DIR), JSON.stringify(list, null, 2) + "\n");
}
const deadNames = [...new Set(dead)].sort();
writeFileSync(DEAD_OUTPUT, JSON.stringify(deadNames, null, 2) + "\n");
const sortedRedirects = Object.fromEntries(
  Object.entries(redirects).sort(([a], [b]) => (a < b ? -1 : 1)),
);
writeFileSync(REDIRECTS_FILE, JSON.stringify(sortedRedirects, null, 2) + "\n");

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
