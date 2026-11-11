<script setup>
import { ref } from "vue";
import { useT } from "../i18n/index.js";
const T = useT("iso", {
  version: "Version", size: "Size", download: "Download", torrent: "Torrent", copy: "copy", copied: "copied",
  tags: ["Recommended", "Minimal", "Offline", "Virtual machine"],
  desc: [
    "XFCE desktop with a curated set of common tools and a GUI installer.",
    "Small boot image. Pick only what you need; requires internet.",
    "Every tool at build time. Expect conflicts when updating; meant for offline installs.",
    "Ready-made appliance for VirtualBox, VMware and QEMU.",
  ],
});
const mirror = "https://ftp.halifax.rwth-aachen.de/blackarch/";
const tor = "https://blackarch.org/blackarch/torrent/";
const images = [
  { name: "Slim", tag: "Recommended", d: "XFCE desktop with a curated set of common tools and a GUI installer.", v: "2023.05.01", size: "5.5 GB", file: "iso/blackarch-linux-slim-2023.05.01-x86_64.iso", sha: "00949f2908e66314906dce6afc6eaad562349250", feat: true },
  { name: "NetInstall", tag: "Minimal", d: "Small boot image. Pick only what you need; requires internet.", v: "2023.04.01", size: "815 MB", file: "iso/blackarch-linux-netinst-2023.04.01-x86_64.iso", sha: "df2dfcfafa1a8f9bab8afd9aa6b788de00e03e09" },
  { name: "Full", tag: "Offline", d: "Every tool at build time. Expect conflicts when updating; meant for offline installs.", v: "2023.04.01", size: "22 GB", file: "iso/blackarch-linux-full-2023.04.01-x86_64.iso", sha: "ae64930aeddc491a4644bb3fa92a715145713c65" },
  { name: "OVA", tag: "Virtual machine", d: "Ready-made appliance for VirtualBox, VMware and QEMU.", v: "2023.04.01", size: "29 GB", file: "ova/blackarch-linux-2023.04.01.ova", sha: "6c2ac1739b4f971bd7eef12d752ccf868a8065bd" },
];
const copied = ref("");
async function copy(sha) {
  try { await navigator.clipboard.writeText(sha); copied.value = sha; setTimeout(() => (copied.value = ""), 1500); } catch {}
}
</script>

<template>
  <div class="cards">
    <article v-for="(i, n) in images" :key="i.name" :class="{ feat: i.feat }">
      <header>
        <h3>{{ i.name }}</h3>
        <span class="tag">{{ T.tags[n] }}</span>
      </header>
      <p>{{ T.desc[n] }}</p>
      <dl>
        <div><dt>{{ T.version }}</dt><dd>{{ i.v }}</dd></div>
        <div><dt>{{ T.size }}</dt><dd>{{ i.size }}</dd></div>
      </dl>
      <button type="button" class="sha" @click="copy(i.sha)" :title="'Copy SHA1 ' + i.sha">
        <span>SHA1</span><code>{{ i.sha.slice(0, 12) }}…{{ i.sha.slice(-6) }}</code><em>{{ copied === i.sha ? T.copied : T.copy }}</em>
      </button>
      <footer>
        <a class="dl" :href="mirror + i.file">{{ T.download }}</a>
        <a class="tr" :href="tor + i.file.split('/')[1] + '.torrent'">{{ T.torrent }}</a>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin: 20px 0; }
article { display: flex; flex-direction: column; gap: 12px; padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); transition: border-color .2s, transform .2s; }
article:hover { border-color: var(--vp-c-brand-1); transform: translateY(-3px); }
article.feat { border-color: var(--vp-c-brand-1); background: linear-gradient(180deg, var(--ba-red-soft), var(--vp-c-bg-soft) 60%); }
header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
h3 { margin: 0; font-size: 20px; letter-spacing: -.02em; }
.tag { font: 11px var(--vp-font-family-mono); text-transform: uppercase; letter-spacing: .06em; padding: 2px 8px; border-radius: 99px; border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); }
.feat .tag { background: var(--ba-red); border-color: var(--ba-red); color: #fff; }
p { margin: 0; flex: 1; font-size: 14px; line-height: 1.6; color: var(--vp-c-text-2); }
dl { display: flex; gap: 24px; margin: 0; }
dt { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--vp-c-text-3); }
dd { margin: 0; font: 600 14px var(--vp-font-family-mono); }
.sha { display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 10px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer; color: var(--vp-c-text-2); font-size: 12px; }
.sha:hover { border-color: var(--vp-c-brand-1); }
.sha code { flex: 1; text-align: left; background: none; padding: 0; font-size: 12px; color: var(--vp-c-text-1); }
.sha em { font-style: normal; color: var(--vp-c-brand-1); }
footer { display: flex; gap: 8px; }
footer a { flex: 1; text-align: center; padding: 8px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; }
.dl { background: var(--ba-red); color: #fff; }
.dl:hover { filter: brightness(1.15); }
.tr { border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-1); }
.tr:hover { border-color: var(--vp-c-brand-1); }
@media (prefers-reduced-motion: reduce) { article { transition: none; } }
</style>
