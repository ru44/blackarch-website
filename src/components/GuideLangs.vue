<script setup>
import { withBase } from "vitepress";

const base = "https://blackarch.org/";
// code, English name, native name, PDF file
const guides = [
  ["EN", "English", "English", "guide.pdf"],
  ["ES", "Spanish", "Español", "guide-es.pdf"],
  ["FR", "French", "Français", "guide-fr.pdf"],
  ["DE", "German", "Deutsch", "guide-de.pdf"],
  ["PT", "Portuguese", "Português", "guide-pt.pdf"],
  ["BR", "Brazilian", "Português (Brasil)", "guide-br.pdf"],
  ["RU", "Russian", "Русский", "guide-ru.pdf"],
  ["TR", "Turkish", "Türkçe", "guide-tr.pdf"],
  ["ZH", "Chinese", "中文", "guide-cn.pdf"],
  ["EL", "Greek", "Ελληνικά", "guide-gr.pdf"],
  ["ID", "Indonesian", "Bahasa Indonesia", "guide-id.pdf"],
  ["IT", "Italian", "Italiano", "guide-it.pdf"],
  ["RO", "Romanian", "Română", "guide-ro.pdf"],
];
</script>

<template>
  <div>
    <a class="start" :href="withBase('/install')">
      <div>
        <strong>New here? Start with the install tutorial</strong>
        <span>Step by step, for beginners, using the live or netinstall ISO.</span>
      </div>
      <em>Open tutorial &rarr;</em>
    </a>

    <h2>Download the guide (PDF)</h2>
    <div class="grid">
      <a v-for="g in guides" :key="g[0]" :href="base + g[3]" target="_blank" rel="noopener noreferrer" class="card">
        <span class="code">{{ g[0] }}</span>
        <span class="names">
          <strong lang="x-native">{{ g[2] }}</strong>
          <small v-if="g[1] !== g[2]">{{ g[1] }}</small>
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M5 20h14" /></svg>
      </a>

      <a class="card help" href="https://github.com/BlackArch/blackarch-guide/tree/master/latex" target="_blank" rel="noopener noreferrer">
        <span class="code">+</span>
        <span class="names">
          <strong>Your language is missing?</strong>
          <small>Translate the guide from the LaTeX source and open a pull request.</small>
        </span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.start { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin: 24px 0 8px; padding: 18px 20px; border: 1px solid var(--vp-c-brand-1); border-radius: 12px; background: linear-gradient(90deg, var(--ba-red-soft), var(--vp-c-bg-soft)); text-decoration: none; color: inherit; transition: transform .2s; }
.start:hover { transform: translateY(-2px); }
.start div { display: flex; flex-direction: column; gap: 2px; }
.start span { font-size: 14px; color: var(--vp-c-text-2); }
.start em { font-style: normal; font-weight: 600; color: var(--vp-c-brand-1); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; margin: 16px 0; }
.card { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); text-decoration: none; color: inherit; transition: border-color .2s, transform .2s; }
.card:hover { border-color: var(--vp-c-brand-1); transform: translateY(-2px); }
.code { flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 10px; font: 700 13px var(--vp-font-family-mono); letter-spacing: .02em; color: var(--vp-c-brand-1); background: var(--ba-red-soft); border: 1px solid var(--vp-c-divider); }
.names { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.names strong { font-size: 15px; font-weight: 600; }
.names small { font-size: 12.5px; color: var(--vp-c-text-2); line-height: 1.45; }
.card svg { flex: none; width: 18px; height: 18px; color: var(--vp-c-text-3); transition: color .2s, transform .2s; }
.card:hover svg { color: var(--vp-c-brand-1); transform: translateY(2px); }
.help { border-style: dashed; background: transparent; }
@media (prefers-reduced-motion: reduce) { .start, .card, .card svg { transition: none; } }
</style>
