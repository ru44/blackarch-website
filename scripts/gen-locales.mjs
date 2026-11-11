// Generates the per-language page stubs under src/<code>/ from src/i18n/meta.json.
// Prose pages include the English source and show a "not translated" banner;
// the home page is translated. Run: node scripts/gen-locales.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const meta = JSON.parse(readFileSync("src/i18n/meta.json", "utf8"));
const pages = ["downloads", "guide", "install", "faq", "tools", "architecture", "community", "donate"];
const wide = new Set(["guide", "tools", "community", "donate", "architecture", "downloads", "faq"]);

for (const [code, d] of Object.entries(meta)) {
  mkdirSync(`src/${code}`, { recursive: true });
  pages.forEach((p, i) => {
    const fm = [`title: ${d.titles[i]}`, ...(wide.has(p) ? ["pageClass: wide"] : []), "outline: false"].join("\n");
    writeFileSync(`src/${code}/${p}.md`, `---\n${fm}\n---\n\n<div class="ba-banner">\n\n::: info\n${d.banner}\n:::\n\n</div>\n\n<!--@include: ../${p}.md-->\n`);
  });
  writeFileSync(`src/${code}/index.md`, `---
layout: home
title: BlackArch Linux
hero:
  name: "BlackArch Linux"
  text: ""
  tagline: ${d.tagline}
  actions:
    - theme: brand
      text: ${d.actions[0]}
      link: /${code}/downloads
    - theme: alt
      text: ${d.actions[1]}
      link: /${code}/guide
  image:
    src: /ba-logo.png
    alt: BlackArch Linux
---

<script setup>
import HomeIntro from '@/components/HomeIntro.vue'
import ScreenShowcase from '@/components/ScreenShowcase.vue'
</script>

<HomeIntro />

<ScreenShowcase />
`);
}
console.log("generated", Object.keys(meta).join(", "));
