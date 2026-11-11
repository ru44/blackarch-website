// Search-engine and link-preview metadata for every page.
//
// Each language has its own copy of every page, but most of them are stubs
// that show the English text. To avoid presenting the same text as 15
// different pages, a stub points search engines at the English page
// (canonical) and is left out of the sitemap. Real translations get their own
// address and are linked to each other with hreflang.
import { existsSync, readFileSync } from "node:fs";
import { faq } from "../data/faq.js";

const CONTENT_DIR = new URL("../content/", import.meta.url);

/** JSON-LD for a <script> tag: "<" is escaped so the data can never close the tag. */
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

/** The text of an HTML snippet, without tags. */
function plainText(html) {
  let text = html;
  for (let previous; previous !== text; ) {
    previous = text;
    text = text.replace(/<[^>]*>/g, "");
  }
  return text.replace(/[<>]/g, "").replace(/&amp;/g, "&").trim();
}

/** An FAQ answer (blocks of p / ul / code) as plain text. */
const answerText = (blocks) =>
  blocks
    .map((block) => {
      if (block.p) return plainText(block.p);
      if (block.ul) return block.ul.map(plainText).join(" ");
      return block.code;
    })
    .join("\n");

export function createSeo({ siteUrl, title, description, locales }) {
  const codes = Object.keys(locales);

  /** "it/faq" -> { code: "it", page: "faq" }; "faq" -> { code: null, page: "faq" } */
  function parse(path) {
    const [first, ...rest] = path.split("/");
    return codes.includes(first)
      ? { code: first, page: rest.join("/") }
      : { code: null, page: path };
  }

  const urlFor = (code, page) => siteUrl + (code ? `${code}/` : "") + page;

  const translatedCache = new Map();
  /** English pages and every home page are real; other pages only when marked `translated: true`. */
  function isTranslated(code, page) {
    if (!code || page === "") return true;
    const key = `${code}/${page}`;
    if (!translatedCache.has(key)) {
      const file = new URL(`${key}.md`, CONTENT_DIR);
      translatedCache.set(
        key,
        existsSync(file) && /^translated:\s*true\s*$/m.test(readFileSync(file, "utf8")),
      );
    }
    return translatedCache.get(key);
  }

  /** FAQPage structured data, using the translated questions when a language has them. */
  async function faqData(code) {
    const translated = code
      ? ((await import(`../i18n/locales/${code}.js`)).default.faqItems?.items ?? {})
      : {};
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: code ? locales[code].lang : "en",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: translated[item.id]?.q ?? item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: answerText(translated[item.id]?.a ?? item.a),
        },
      })),
    };
  }

  const cleanPath = (relativePath) =>
    relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.(md|html)$/, "");
  const isRedirect = (page) => page === "news";

  async function transformPageData(pageData) {
    const { code, page } = parse(cleanPath(pageData.relativePath));
    const translated = isTranslated(code, page);
    const canonical = translated ? urlFor(code, page) : urlFor(null, page);

    const pageTitle =
      pageData.title && pageData.title !== title ? `${pageData.title} | ${title}` : title;
    // A translated home page describes itself with its translated tagline.
    const pageDescription =
      pageData.description || (code && page === "" && locales[code].tagline) || description;
    pageData.description ||= pageDescription;

    const head = (pageData.frontmatter.head ??= []);
    head.push(
      ["link", { rel: "canonical", href: canonical }],
      ["meta", { property: "og:url", content: canonical }],
      ["meta", { property: "og:title", content: pageTitle }],
      ["meta", { property: "og:description", content: pageDescription }],
      ["meta", { name: "twitter:title", content: pageTitle }],
      ["meta", { name: "twitter:description", content: pageDescription }],
    );

    if (isRedirect(page)) {
      head.push(["meta", { name: "robots", content: "noindex, follow" }]);
      return;
    }

    // Tell search engines which language versions of this page exist.
    if (translated) {
      const versions = [null, ...codes].filter((other) => isTranslated(other, page));
      for (const other of versions) {
        const hreflang = other ? locales[other].lang : "en";
        head.push(["link", { rel: "alternate", hreflang, href: urlFor(other, page) }]);
      }
      head.push(["link", { rel: "alternate", hreflang: "x-default", href: urlFor(null, page) }]);
    }

    if (page === "") {
      const data = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: title,
        url: urlFor(code, ""),
        description: pageDescription,
        inLanguage: code ? locales[code].lang : "en",
      };
      head.push(["script", { type: "application/ld+json" }, jsonLd(data)]);
    }

    if (page === "faq" && translated) {
      head.push(["script", { type: "application/ld+json" }, jsonLd(await faqData(code))]);
    }
  }

  const sitemap = {
    hostname: siteUrl,
    // Only real pages: no redirects and no untranslated stubs.
    transformItems: (items) =>
      items.filter((item) => {
        const { code, page } = parse(cleanPath(item.url).replace(/\/$/, ""));
        return !isRedirect(page) && isTranslated(code, page);
      }),
  };

  return { transformPageData, sitemap };
}
