<script setup>
import { useClipboard } from "../composables/useClipboard.js";
import { ref } from "vue";
import { useT } from "../i18n/index.js";

const T = useT("journey", {
  title: "How a tool reaches you",
  mine: "Your side of the journey",
  copy: "copy",
  copied: "copied",
  stations: [
    { t: "Upstream", who: "Tool author", out: "source / release" },
    { t: "Package", who: "Maintainer", out: "PKGBUILD" },
    { t: "Build & sign", who: "Developer", out: ".pkg.tar.zst + .sig" },
    { t: "Release", who: "Build server", out: "blackarch.db" },
    { t: "Mirrors", who: "Mirror operators", out: "rsync copy" },
    { t: "You", who: "pacman", out: "installed tool" },
  ],
  steps: ["1. Add the repo", "2. Sync", "3. Install a tool"],
});

const { copy, isCopied } = useClipboard(1400);
const icons = [
  "M8 6l-5 6 5 6M16 6l5 6-5 6",
  "M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8",
  "M14 7l3 3-8 8H6v-3zM13 8l3 3",
  "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  "M4 5h16v11H4zM8 20h8M12 16v4",
];
const cmds = [
  "curl -O https://blackarch.org/strap.sh && sudo ./strap.sh",
  "sudo pacman -Syu",
  "sudo pacman -S nmap",
];
</script>

<template>
  <div class="journey">
    <p class="label">{{ T.title }}</p>
    <ol class="track">
      <li v-for="(s, i) in T.stations" :key="i" :style="{ '--d': i * 0.5 + 's' }">
        <span class="node"
          ><svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path :d="icons[i]" /></svg
        ></span>
        <strong>{{ s.t }}</strong>
        <em>{{ s.who }}</em>
        <code>{{ s.out }}</code>
      </li>
    </ol>

    <p class="label">{{ T.mine }}</p>
    <ol class="mine">
      <li v-for="(l, i) in T.steps" :key="i">
        <span>{{ l }}</span>
        <div>
          <code>{{ cmds[i] }}</code
          ><button type="button" @click="copy(cmds[i])">
            {{ isCopied(cmds[i]) ? T.copied : T.copy }}
          </button>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.journey {
  margin: 20px 0 32px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  box-shadow: var(--ba-shadow);
}
.label {
  margin: 0 0 14px;
  font: 600 11px var(--vp-font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-3);
}
.track {
  list-style: none;
  margin: 0 0 28px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  position: relative;
}
.track::before {
  content: "";
  position: absolute;
  inset-inline-start: 8.3%;
  inset-inline-end: 8.3%;
  top: 27px;
  height: 2px;
  background: repeating-linear-gradient(90deg, var(--ba-red) 0 8px, transparent 8px 14px);
  opacity: 0.7;
}
.track li {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3px;
  margin: 0;
  padding: 0 4px;
}
.node {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--vp-c-bg);
  border: 2px solid var(--ba-red);
  color: var(--vp-c-brand-1);
  z-index: 1;
  animation: pulse 3s ease-in-out infinite;
  animation-delay: var(--d);
}
.node svg {
  width: 24px;
  height: 24px;
}
.track strong {
  margin-top: 8px;
  font-size: 14px;
}
.track em {
  font-style: normal;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.track code {
  margin-top: 4px;
  font-size: 11px;
  background: none;
  color: var(--vp-c-text-3);
  overflow-wrap: anywhere;
  direction: ltr;
  unicode-bidi: isolate;
}
.mine {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}
.mine li {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mine span {
  font-size: 13px;
  font-weight: 600;
}
.mine div {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 6px 6px 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  flex: 1;
  direction: ltr;
  unicode-bidi: isolate;
  text-align: left;
}
.mine code {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  background: none;
  padding: 0;
  overflow-wrap: anywhere;
}
.mine code::before {
  content: "$ ";
  color: var(--ba-red);
}
.mine button {
  flex: none;
  font: 11px var(--vp-font-family-mono);
  padding: 3px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.mine button:hover {
  border-color: var(--vp-c-brand-1);
}
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(230, 0, 0, 0);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(230, 0, 0, 0.18);
  }
}
@media (max-width: 720px) {
  .track {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .track::before {
    inset-inline-start: 27px;
    inset-inline-end: auto;
    top: 20px;
    bottom: 20px;
    width: 2px;
    height: auto;
    background: repeating-linear-gradient(180deg, var(--ba-red) 0 8px, transparent 8px 14px);
  }
  .track li {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    text-align: left;
    gap: 2px 12px;
    padding-inline-start: 0;
  }
  .node {
    flex: none;
  }
  .track strong {
    margin: 0;
    align-self: center;
  }
}
@media (prefers-reduced-motion: reduce) {
  .node {
    animation: none;
  }
}
</style>
