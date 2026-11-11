// Tells Bing (and the search engines that use its index, such as DuckDuckGo)
// which pages exist, through the IndexNow protocol: https://www.indexnow.org
// Run it after a deploy: node scripts/submit-indexnow.mjs
const SITE = "https://ru44.github.io/blackarch-website/";
// Not a secret: the key only proves that the site owner sent the list. The
// same value is published at KEY_LOCATION (src/content/public/<key>.txt).
const KEY = "28212a172578d79ed97f44fc1ebbc9cf";
const KEY_LOCATION = `${SITE}${KEY}.txt`;

const sitemap = await (await fetch(`${SITE}sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urlList.length) throw new Error("The sitemap lists no pages.");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});
console.log(`Submitted ${urlList.length} pages: HTTP ${response.status} ${response.statusText}`);
if (!response.ok) process.exitCode = 1;
