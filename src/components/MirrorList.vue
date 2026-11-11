<script setup>
import { computed, ref } from "vue";
import { useClipboard } from "../composables/useClipboard.js";
import { useT } from "../i18n/index.js";
import mirrors from "../data/mirrors.json";

const T = useT("mirrors", {
  title: "Official BlackArch Linux Mirror Sites",
  summary: (countries, total) => `${countries} countries, ${total} mirrors. Pick one near you.`,
  placeholder: "Search by country or mirror URL…",
  noMatch: "No mirrors match",
  clear: "Clear search",
  copy: "copy",
  ok: "ok",
});

const { copy, isCopied } = useClipboard();
const searchQuery = ref("");
const total = Object.values(mirrors).reduce((sum, urls) => sum + urls.length, 0);

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return mirrors;
  const result = {};
  for (const [country, urls] of Object.entries(mirrors)) {
    if (country.toLowerCase().includes(q)) {
      result[country] = urls;
      continue;
    }
    const matching = urls.filter((url) => url.toLowerCase().includes(q));
    if (matching.length) result[country] = matching;
  }
  return result;
});

const protocol = (url) => url.split(":")[0];
const host = (url) => url.replace(/^[a-z]+:\/\//, "");
</script>

<template>
  <div>
    <h2 id="official-blackarch-linux-mirror-sites">{{ T.title }}</h2>
    <p class="meta">{{ T.summary(Object.keys(mirrors).length, total) }}</p>

    <div class="search">
      <input v-model="searchQuery" type="search" :placeholder="T.placeholder" :aria-label="T.placeholder" />
    </div>

    <div class="grid">
      <section v-for="(urls, country) in filtered" :key="country" class="card">
        <header><h3>{{ country }}</h3><span>{{ urls.length }}</span></header>
        <ul>
          <li v-for="u in urls" :key="u">
            <span class="proto" :data-p="protocol(u)">{{ protocol(u) }}</span>
            <a :href="u" target="_blank" rel="noopener noreferrer" :title="u">{{ host(u) }}</a>
            <button type="button" :aria-label="`Copy ${u}`" @click="copy(u)">{{ isCopied(u) ? T.ok : T.copy }}</button>
          </li>
        </ul>
      </section>
    </div>

    <p v-if="!Object.keys(filtered).length" class="empty">
      {{ T.noMatch }} “{{ searchQuery }}”.
      <button type="button" @click="searchQuery = ''">{{ T.clear }}</button>
    </p>
  </div>
</template>

<style scoped>
.meta { margin: 4px 0 12px; color: var(--vp-c-text-2); font-size: 14px; }
.search input { width: 100%; height: 42px; padding: 0 14px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font: 14px var(--vp-font-family-mono); }
.search input:focus { outline: none; border-color: var(--vp-c-brand-1); }
.grid { columns: 3 280px; column-gap: 14px; margin-top: 16px; }
.card { break-inside: avoid; margin-bottom: 14px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); overflow: hidden; }
.card header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-alt); }
.card h3 { margin: 0; font-size: 14px; }
.card header span { font: 11px var(--vp-font-family-mono); color: var(--vp-c-text-3); }
ul { list-style: none; margin: 0; padding: 4px 0; }
li { display: flex; align-items: center; gap: 8px; margin: 0; padding: 5px 14px; }
li:hover { background: var(--ba-red-soft); }
.proto { flex: none; width: 44px; text-align: center; font: 10px var(--vp-font-family-mono); text-transform: uppercase; padding: 1px 0; border-radius: 4px; border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); }
.proto[data-p="https"] { color: #2fa56b; border-color: currentColor; }
.proto[data-p="rsync"] { color: var(--vp-c-brand-1); border-color: currentColor; }
li a { flex: 1; min-width: 0; font: 12px var(--vp-font-family-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-decoration: none; color: var(--vp-c-text-1); }
li a:hover { color: var(--vp-c-brand-1); }
li button { flex: none; font: 11px var(--vp-font-family-mono); background: none; border: 0; color: var(--vp-c-text-3); cursor: pointer; }
li button:hover { color: var(--vp-c-brand-1); }
.empty { color: var(--vp-c-text-2); }
.empty button { margin-left: 8px; color: var(--vp-c-brand-1); background: none; border: 0; cursor: pointer; text-decoration: underline; }
</style>
