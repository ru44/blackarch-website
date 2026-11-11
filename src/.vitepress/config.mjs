import { readFileSync } from "node:fs";
import { defineConfig } from "vitepress";
import { matrixIcon } from "./icons.mjs";

const REPO_URL = "https://github.com/ru44/blackarch-website";
const SITE_URL = "https://ru44.github.io/blackarch-website/";
const SITE_TITLE = "BlackArch Linux";
const SITE_DESCRIPTION =
  "BlackArch Linux is a penetration testing distribution for penetration testers and security researchers.";
const EDIT_PATTERN = `${REPO_URL}/edit/main/src/content/:path`;

// Language names, nav labels and UI strings for every translated locale.
// The English labels below are the source; src/i18n/meta.json holds the rest.
const LOCALES = JSON.parse(readFileSync(new URL("../i18n/meta.json", import.meta.url), "utf8"));

const ENGLISH = {
  nav: ["Home", "Downloads", "Guide", "FAQ", "Tools", "Architecture", "Community & News", "Donate"],
  sidebar: ["Downloads", "Guide", "Installation", "FAQ", "Tools", "Architecture"],
};

// `prefix` is "" for English and "/it", "/ar", ... for translated locales.
function navItems(prefix, labels) {
  const pages = ["", "downloads", "guide", "faq", "tools", "architecture", "community", "donate"];
  return pages.map((page, i) => ({ text: labels[i], link: `${prefix}/${page}` }));
}

function sidebarItems(prefix, labels) {
  const pages = ["downloads", "guide", "install", "faq", "tools", "architecture"];
  return pages.map((page, i) => ({ text: labels[i], link: `${prefix}/${page}` }));
}

function localeConfig(code, locale) {
  const prefix = `/${code}`;
  return {
    label: locale.label,
    lang: locale.lang,
    ...(locale.dir && { dir: locale.dir }),
    link: `${prefix}/`,
    themeConfig: {
      nav: navItems(prefix, locale.nav),
      sidebar: sidebarItems(prefix, locale.side),
      outline: { label: locale.outline },
      returnToTopLabel: locale.ret,
      sidebarMenuLabel: locale.sbmenu,
      darkModeSwitchLabel: locale.dark,
      langMenuLabel: locale.langm,
      docFooter: { prev: locale.prev, next: locale.next },
      editLink: { pattern: EDIT_PATTERN, text: locale.edit },
    },
  };
}

function localeSearchTranslations(locale) {
  return {
    translations: {
      button: { buttonText: locale.search.button, buttonAriaLabel: locale.search.aria },
      modal: {
        noResultsText: locale.search.none,
        resetButtonTitle: locale.search.reset,
        backButtonTitle: locale.search.back,
      },
    },
  };
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blackarch-website/",

  // Pages live in src/content/<language>/. English is served from the site
  // root, every other language under its own prefix (/it/, /ar/, ...).
  srcDir: "content",
  rewrites: { "en/:page*": ":page*" },
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  head: [
    ["link", { rel: "icon", type: "image/x-icon", href: "/blackarch-website/favicon.ico" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: SITE_TITLE }],
    ["meta", { property: "og:image", content: `${SITE_URL}og.jpg` }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:image", content: `${SITE_URL}og.jpg` }],
  ],
  appearance: "dark",
  // /tools instead of /tools.html (GitHub Pages serves both).
  cleanUrls: true,
  lastUpdated: true,
  markdown: { image: { lazyLoading: true } },

  sitemap: {
    hostname: SITE_URL,
    // /news only redirects to the community page.
    transformItems: (items) => items.filter((item) => !/(^|\/)news(\.html)?$/.test(item.url)),
  },

  // Link previews: each page gets its own address, title and description.
  transformPageData(pageData) {
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
    const url = SITE_URL + path;
    const pageTitle =
      pageData.title && pageData.title !== SITE_TITLE
        ? `${pageData.title} | ${SITE_TITLE}`
        : SITE_TITLE;
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:title", content: pageTitle }],
      ["meta", { property: "og:description", content: pageData.description || SITE_DESCRIPTION }],
    );
  },

  vite: {
    // `@/components/...` resolves from any page, including per-language ones.
    resolve: { alias: { "@": new URL("../", import.meta.url).pathname } },
  },

  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        nav: navItems("", ENGLISH.nav),
        sidebar: sidebarItems("", ENGLISH.sidebar),
      },
    },
    ...Object.fromEntries(
      Object.entries(LOCALES).map(([code, locale]) => [code, localeConfig(code, locale)]),
    ),
  },

  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    editLink: { pattern: EDIT_PATTERN, text: "Edit this page on GitHub" },
    search: {
      provider: "local",
      options: {
        locales: Object.fromEntries(
          Object.entries(LOCALES).map(([code, locale]) => [code, localeSearchTranslations(locale)]),
        ),
      },
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/BlackArch" },
      { icon: "x", link: "https://x.com/BlackArchLinux" },
      { icon: matrixIcon, link: "https://matrix.to/#/#BlackArch:matrix.org" },
    ],
  },
});
