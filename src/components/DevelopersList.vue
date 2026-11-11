<script setup>
import { ref } from "vue";
import { withBase } from "vitepress";
import { useClipboard } from "../composables/useClipboard.js";
import { useT } from "../i18n/index.js";
import developers from "../data/developers.json";

const T = useT("people", {
  copy: "copy",
  copied: "copied",
  label: "BlackArch developers",
});

const { copy, isCopied } = useClipboard();
// Avatars that fail to load fall back to the initials badge.
const broken = ref({});
const initials = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
</script>

<template>
  <section class="people" :aria-label="T.label">
    <article v-for="d in developers" :key="d.nickname">
      <div class="top">
        <a v-if="d.github" class="avatar-link" :href="`https://github.com/${d.github}`" target="_blank" rel="noopener noreferrer" :aria-label="`${d.name} on GitHub`">
          <img v-if="d.avatar && !broken[d.nickname]" class="avatar img" :src="withBase('/' + d.avatar)" :alt="d.name" width="44" height="44" loading="lazy" @error="broken[d.nickname] = true" />
          <span v-else class="avatar" aria-hidden="true">{{ initials(d.name) }}</span>
        </a>
        <span v-else class="avatar" aria-hidden="true">{{ initials(d.name) }}</span>
        <div>
          <h3>{{ d.name }}</h3>
          <span class="nick">@{{ d.nickname }}</span>
          <a v-if="d.github" class="gh" :href="`https://github.com/${d.github}`" target="_blank" rel="noopener noreferrer">github/{{ d.github }}</a>
        </div>
      </div>
      <span class="role">{{ d.role }}</span>
      <a class="mail" :href="`mailto:${d.email}`">{{ d.email }}</a>
      <button type="button" class="key" @click="copy(d.gpg_key)" :title="`Copy GPG key ${d.gpg_key}`">
        <span>GPG</span><code>{{ d.gpg_key }}</code><em>{{ isCopied(d.gpg_key) ? T.copied : T.copy }}</em>
      </button>
    </article>
  </section>
</template>

<style scoped>
.people { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; margin: 16px 0; }
article { display: flex; flex-direction: column; gap: 10px; padding: 18px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); transition: border-color .2s, transform .2s; }
article:hover { border-color: var(--vp-c-brand-1); transform: translateY(-2px); }
.top { display: flex; align-items: center; gap: 12px; }
.avatar { flex: none; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font: 700 15px var(--vp-font-family-mono); color: #fff; background: radial-gradient(circle at 30% 30%, #ff4d4d, #8a0000); box-shadow: 0 0 0 2px var(--vp-c-bg-soft), 0 0 0 3px var(--ba-red); }
h3 { margin: 0; font-size: 15px; line-height: 1.3; }
.avatar-link { flex: none; line-height: 0; border-radius: 50%; }
.avatar.img { object-fit: cover; background: var(--vp-c-bg); }
.gh { display: block; font: 12px var(--vp-font-family-mono); color: var(--vp-c-text-3); text-decoration: none; }
.gh:hover { color: var(--vp-c-brand-1); }
.nick { font: 12px var(--vp-font-family-mono); color: var(--vp-c-text-2); }
.role { align-self: flex-start; font: 11px var(--vp-font-family-mono); text-transform: uppercase; letter-spacing: .06em; padding: 2px 8px; border-radius: 99px; background: var(--ba-red-soft); color: var(--vp-c-brand-1); }
.mail { font-size: 13px; text-decoration: none; overflow-wrap: anywhere; }
.mail:hover { text-decoration: underline; }
.key { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 10px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer; font-size: 11px; color: var(--vp-c-text-3); }
.key:hover { border-color: var(--vp-c-brand-1); }
.key code { flex: 1; text-align: left; background: none; padding: 0; font-size: 12px; color: var(--vp-c-text-1); overflow: hidden; text-overflow: ellipsis; }
.key em { font-style: normal; color: var(--vp-c-brand-1); }
@media (prefers-reduced-motion: reduce) { article { transition: none; } }
</style>
