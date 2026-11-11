import { readFileSync } from "node:fs";
import { defineConfig } from "vitepress";

// Build nav + sidebar for a locale prefix ("" for English, "/ar" etc.)
const navFor = (p, t) => [
  { text: t[0], link: `${p}/` },
  { text: t[1], link: `${p}/downloads` },
  { text: t[2], link: `${p}/guide` },
  { text: t[3], link: `${p}/faq` },
  { text: t[4], link: `${p}/tools` },
  { text: t[5], link: `${p}/architecture` },
  { text: t[6], link: `${p}/community` },
  { text: t[7], link: `${p}/donate` },
];
const sideFor = (p, t) =>
  ["downloads", "guide", "install", "faq", "tools", "architecture"].map(
    (page, i) => ({ text: t[i], link: `${p}/${page}` })
  );

const EN_NAV = ["Home", "Downloads", "Guide", "FAQ", "Tools", "Architecture", "Community & News", "Donate"];
const EN_SIDE = ["Downloads", "Guide", "Installation", "FAQ", "Tools", "Architecture"];

const LOCALES = JSON.parse(
  readFileSync(new URL("../i18n/meta.json", import.meta.url), "utf8")
);

const loc = (code, d) => ({
  label: d.label,
  lang: d.lang,
  ...(d.dir ? { dir: d.dir } : {}),
  link: `/${code}/`,
  themeConfig: {
    nav: navFor(`/${code}`, d.nav),
    sidebar: sideFor(`/${code}`, d.side),
    outline: { label: d.outline },
    returnToTopLabel: d.ret,
    sidebarMenuLabel: d.sbmenu,
    darkModeSwitchLabel: d.dark,
    langMenuLabel: d.langm,
    docFooter: { prev: d.prev, next: d.next },
    editLink: {
      pattern: "https://github.com/ru44/blackarch-website/edit/main/src/:path",
      text: d.edit,
    },
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blackarch-website/",
  title: "BlackArch Linux",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/blackarch-website/favicon.ico",
      },
    ],
  ],
  description:
    "BlackArch Linux is a penetration testing distribution for penetration testers and security researchers.",
  appearance: "dark",
  lastUpdated: true,
  vite: {
    resolve: { alias: { "@": new URL("../", import.meta.url).pathname } },
  },
  markdown: {
    image: {
      lazyLoading: true,
    },
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        nav: navFor("", EN_NAV),
        sidebar: sideFor("", EN_SIDE),
      },
    },
    ...Object.fromEntries(
      Object.entries(LOCALES).map(([k, d]) => [k, loc(k, d)])
    ),
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    editLink: {
      pattern: "https://github.com/ru44/blackarch-website/edit/main/src/:path",
      text: "Edit this page on GitHub",
    },
    search: {
      provider: "local",
      options: {
        locales: Object.fromEntries(
          Object.entries(LOCALES).map(([k, d]) => [
            k,
            {
              translations: {
                button: { buttonText: d.search.button, buttonAriaLabel: d.search.aria },
                modal: {
                  noResultsText: d.search.none,
                  resetButtonTitle: d.search.reset,
                  backButtonTitle: d.search.back,
                },
              },
            },
          ])
        ),
      },
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/BlackArch" },
      { icon: "x", link: "https://x.com/BlackArchLinux" },
      {
        icon: {
          svg: '<svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60.019 60.019" xml:space="preserve"><g><path d="M59.888,47.514l-3.839-11.518c2.056-3.615,3.14-7.716,3.14-11.893c0-13.286-10.809-24.095-24.095-24.095c-8.242,0-15.824,4.223-20.219,11.007c3.089-1.291,6.477-2.007,10.029-2.007C39.294,9.01,51,20.716,51,35.104c0,3.996-0.905,7.783-2.518,11.172l10.263,2.701c0.085,0.022,0.17,0.033,0.255,0.033c0.006,0,0.014-0.001,0.02,0c0.553,0,1-0.448,1-1C60.019,47.829,59.972,47.66,59.888,47.514z"/><path d="M24.905,11.01C11.619,11.01,0.81,21.819,0.81,35.104c0,4.176,1.084,8.277,3.14,11.893L0.051,58.693c-0.116,0.349-0.032,0.732,0.219,1C0.462,59.898,0.727,60.01,1,60.01c0.085,0,0.17-0.011,0.255-0.033l12.788-3.365c3.35,1.694,7.097,2.587,10.862,2.587C38.191,59.199,49,48.39,49,35.104S38.191,11.01,24.905,11.01z M41.246,26.799c-0.152,0.083-0.317,0.123-0.479,0.123c-0.354,0-0.696-0.188-0.878-0.519c-2.795-5.097-8.115-8.679-13.883-9.349c-0.549-0.063-0.941-0.56-0.878-1.108c0.063-0.548,0.558-0.942,1.108-0.878c6.401,0.743,12.304,4.718,15.406,10.373C41.908,25.926,41.73,26.534,41.246,26.799z"/></g></svg>',
        },
        link: "https://matrix.to/#/#BlackArch:matrix.org",
      },
    ],
  },
});
