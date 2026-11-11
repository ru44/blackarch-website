<script setup>
import { ref, computed } from "vue";
import { useT } from "../i18n/index.js";
const T = useT("shots", { title: "See it running", full: "Full ISO", slim: "Slim ISO", aria: "BlackArch screenshots" });
const base = "https://blackarch.org/images/screenshots/";
const sets = {
  Full: {
    label: "Full ISO",
    shots: [
      ["fluxbox", "Fluxbox", "jpg"], ["i3", "i3", "jpg"], ["awesome", "Awesome", "jpg"],
      ["spectrwm", "spectrwm", "jpg"], ["lxdm", "LXDM login", "jpg"], ["grub", "GRUB menu", "jpg"],
    ],
  },
  Slim: {
    label: "Slim ISO",
    shots: [["menu_slim", "XFCE menu", "png"], ["menu_slim_two", "Tool categories", "png"], ["terminal_slim", "Terminal", "png"]],
  },
};
const setKey = ref("Full");
const idx = ref(0);
const shots = computed(() => sets[setKey.value].shots);
const cur = computed(() => shots.value[idx.value]);
const src = (s) => `${base}${s[0]}.${s[2]}`;
const thumb = (s) => `${base}thumbnails/${s[0]}${s[0].startsWith("menu_slim") || s[0] === "terminal_slim" ? "" : "_thumbnail"}.jpg`;
function setSet(k) { setKey.value = k; idx.value = 0; }
</script>

<template>
  <section class="show" :aria-label="T.aria">
    <div class="head">
      <h2>{{ T.title }}</h2>
      <div class="seg" role="tablist">
        <button v-for="(v, k) in sets" :key="k" role="tab" :aria-selected="setKey === k" :class="{ on: setKey === k }" @click="setSet(k)">{{ k === "Full" ? T.full : T.slim }}</button>
      </div>
    </div>
    <div class="window">
      <div class="bar"><i /><i /><i /><span>{{ cur[1] }}</span></div>
      <a :href="src(cur)" target="_blank" rel="noopener" class="view">
        <img :key="src(cur)" :src="src(cur)" :alt="`BlackArch ${cur[1]} screenshot`" />
      </a>
    </div>
    <div class="strip">
      <button v-for="(s, i) in shots" :key="s[0]" :class="{ on: i === idx }" :aria-label="s[1]" :aria-current="i === idx" @click="idx = i">
        <img :src="thumb(s)" :alt="s[1]" loading="lazy" />
        <span>{{ s[1] }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.show { max-width: 1152px; margin: 64px auto 0; padding: 0 24px; }
.head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
h2 { margin: 0; border: 0; padding: 0; font-size: 24px; }
.seg { display: inline-flex; border: 1px solid var(--vp-c-divider); border-radius: 8px; overflow: hidden; }
.seg button { padding: 6px 14px; font-size: 13px; background: none; color: var(--vp-c-text-2); border: 0; cursor: pointer; }
.seg button.on { background: var(--ba-red); color: #fff; }
.window { border: 1px solid var(--vp-c-divider); border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 24px 60px -24px rgba(230,0,0,.35), var(--ba-shadow); }
.bar { display: flex; align-items: center; gap: 6px; padding: 9px 14px; background: #17171a; border-bottom: 1px solid #26262b; }
.bar i { width: 10px; height: 10px; border-radius: 50%; background: #3a3a40; }
.bar i:first-child { background: #e60000; }
.bar span { margin-left: 10px; font: 12px var(--vp-font-family-mono); color: #8a8a93; }
.view { display: block; aspect-ratio: 16 / 9; background: #000; }
.view img { width: 100%; height: 100%; object-fit: contain; display: block; border: 0; border-radius: 0; animation: fade .3s ease; }
.strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-top: 12px; }
.strip button { padding: 0; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; overflow: hidden; cursor: pointer; text-align: left; opacity: .65; transition: opacity .15s, border-color .15s; }
.strip button:hover, .strip button.on { opacity: 1; }
.strip button.on { border-color: var(--vp-c-brand-1); }
.strip img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border: 0; border-radius: 0; }
.strip span { display: block; padding: 5px 8px; font-size: 12px; color: var(--vp-c-text-2); }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .view img { animation: none; } }
</style>
