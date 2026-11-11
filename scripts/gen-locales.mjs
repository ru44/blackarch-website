// Generates the per-language pages in src/content/<code>/ from src/i18n/meta.json.
//
// Untranslated pages are stubs: a "not translated yet" banner followed by the
// English page. The home page is always generated from the translated tagline.
// Pages with `translated: true` in their frontmatter are written by hand and
// are never overwritten.
//
// Usage: node scripts/gen-locales.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const CONTENT_DIR = "src/content";
const meta = JSON.parse(readFileSync("src/i18n/meta.json", "utf8"));

// Same order as the `titles` array of each locale in meta.json.
const PAGES = [
  "downloads",
  "guide",
  "install",
  "faq",
  "tools",
  "architecture",
  "community",
  "donate",
];
// Every page except the install tutorial uses the wide layout.
const NARROW_PAGES = new Set(["install"]);

const isTranslated = (file) =>
  existsSync(file) &&
  /^---\n[\s\S]*?^translated:\s*true\s*$[\s\S]*?^---/m.test(readFileSync(file, "utf8"));

function stubPage(locale, page, title) {
  const frontmatter = [
    `title: ${title}`,
    ...(NARROW_PAGES.has(page) ? [] : ["pageClass: wide"]),
    "outline: false",
  ].join("\n");

  return `---
${frontmatter}
---

<div class="ba-banner">

::: info
${locale.banner}
:::

</div>

<!--@include: ../en/${page}.md-->
`;
}

function homePage(code, locale) {
  return `---
layout: home
title: BlackArch Linux
hero:
  name: "BlackArch Linux"
  text: ""
  tagline: ${locale.tagline}
  actions:
    - theme: brand
      text: ${locale.actions[0]}
      link: /${code}/downloads
    - theme: alt
      text: ${locale.actions[1]}
      link: /${code}/guide
---

<script setup>
import HomeIntro from '@/components/HomeIntro.vue'
import ScreenShowcase from '@/components/ScreenShowcase.vue'
</script>

<HomeIntro />

<ScreenShowcase />
`;
}

for (const [code, locale] of Object.entries(meta)) {
  const dir = `${CONTENT_DIR}/${code}`;
  mkdirSync(dir, { recursive: true });

  PAGES.forEach((page, i) => {
    const file = `${dir}/${page}.md`;
    if (!isTranslated(file)) writeFileSync(file, stubPage(locale, page, locale.titles[i]));
  });
  writeFileSync(`${dir}/index.md`, homePage(code, locale));
}

console.log(`Generated pages for: ${Object.keys(meta).join(", ")}`);
