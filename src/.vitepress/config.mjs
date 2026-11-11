import { readFileSync } from "node:fs";
import { defineConfig } from "vitepress";
import { matrixIcon } from "./icons.mjs";

const REPO_URL = "https://github.com/ru44/blackarch-website";
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
  title: "BlackArch Linux",
  description:
    "BlackArch Linux is a penetration testing distribution for penetration testers and security researchers.",
  head: [["link", { rel: "icon", type: "image/x-icon", href: "/blackarch-website/favicon.ico" }]],
  appearance: "dark",
  lastUpdated: true,
  markdown: { image: { lazyLoading: true } },

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
