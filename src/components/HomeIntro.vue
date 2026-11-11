<script setup>
import { useClipboard } from "../composables/useClipboard.js";
import { useT } from "../i18n/index.js";
const cmd = "curl -O https://blackarch.org/strap.sh && sudo ./strap.sh";
const { copy, isCopied } = useClipboard();
const T = useT("home", {
  copy: "copy", copied: "copied", copyLabel: "Copy command", quick: "Quick install command",
  stats: [
    { n: "2800+", l: "tools packaged" },
    { n: "x86_64", l: "+ ARM via Arch ARM" },
    { n: "Rolling", l: "release, via pacman" },
    { n: "2013", l: "first release" },
  ],
  features: [
    { t: "Arch at the core", d: "Rolling release, pacman, AUR-friendly. Nothing forked, nothing frozen." },
    { t: "Every tool, one command", d: "Over 2800 tools, each one pacman -S away. Browse them in the tools list." },
    { t: "Install by category", d: "Pull the whole blackarch group or a slice like blackarch-webapp." },
    { t: "Works on your Arch", d: "Add the repo to an existing install with strap.sh. No reinstall needed." },
  ],
});
const icons = ["M12 3 4 20h4l4-9 4 9h4z", "M4 6h16M4 12h16M4 18h10", "M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8", "M5 12l5 5L20 7"];
</script>

<template>
  <section class="intro">
    <div class="term" role="group" :aria-label="T.quick">
      <div class="bar"><i /><i /><i /><span>root@blackarch: ~</span></div>
      <div class="body">
        <code><b>$</b> {{ cmd }}</code>
        <button type="button" @click="copy(cmd)" :aria-label="T.copyLabel">
          {{ isCopied(cmd) ? T.copied : T.copy }}
        </button>
      </div>
    </div>

    <ul class="stats">
      <li v-for="s in T.stats" :key="s.l"><strong>{{ s.n }}</strong><span>{{ s.l }}</span></li>
    </ul>

    <div class="grid">
      <article v-for="(f, i) in T.features" :key="i">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="icons[i]" /></svg>
        <h3>{{ f.t }}</h3>
        <p>{{ f.d }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.intro { max-width: 1152px; margin: 0 auto; padding: 0 24px; }
.term { border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden; background: #0b0b0d; box-shadow: var(--ba-shadow); max-width: 720px; margin: 8px auto 40px; }
.bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #17171a; border-bottom: 1px solid #26262b; }
.bar i { width: 10px; height: 10px; border-radius: 50%; background: #3a3a40; }
.bar i:first-child { background: #e60000; }
.bar span { margin-left: 8px; font: 12px var(--vp-font-family-mono); color: #8a8a93; }
.body { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; }
.body code { font-size: 13px; color: #e8e8ea; background: none; overflow-wrap: anywhere; }
.body b { color: #e60000; margin-right: 6px; }
.body button { flex: none; font: 12px var(--vp-font-family-mono); color: #c9c9ce; background: #17171a; border: 1px solid #2c2c32; border-radius: 6px; padding: 4px 10px; cursor: pointer; }
.body button:hover { border-color: #e60000; color: #fff; }
.stats { list-style: none; margin: 0 0 40px; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); border-block: 1px solid var(--vp-c-divider); }
.stats li { padding: 20px 8px; text-align: center; display: flex; flex-direction: column; gap: 2px; }
.stats li + li { border-left: 1px solid var(--vp-c-divider); }
.stats strong { font: 700 26px var(--vp-font-family-mono); color: var(--vp-c-brand-1); }
.stats span { font-size: 13px; color: var(--vp-c-text-2); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
article { padding: 22px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); transition: border-color .2s, transform .2s; }
article:hover { border-color: var(--vp-c-brand-1); transform: translateY(-3px); }
article svg { width: 26px; height: 26px; color: var(--vp-c-brand-1); }
h3 { margin: 14px 0 6px; font-size: 16px; font-weight: 600; }
p { margin: 0; font-size: 14px; line-height: 1.6; color: var(--vp-c-text-2); }
@media (max-width: 640px) { .stats { grid-template-columns: repeat(2, 1fr); } .stats li:nth-child(3) { border-left: 0; } .stats li:nth-child(n+3) { border-top: 1px solid var(--vp-c-divider); } }
@media (prefers-reduced-motion: reduce) { article { transition: none; } }
</style>
