<script setup>
import { useClipboard } from "../composables/useClipboard.js";
import { useT } from "../i18n/index.js";
import { ref, computed, onMounted } from "vue";
import { withBase, useData } from "vitepress";
import { faq as EN } from "../data/faq.js";

const UI = useT("faq", {
  placeholder: "Search the FAQ…",
  searchLabel: "Search questions",
  all: "All",
  noResults: "No questions match",
  clear: "Clear search",
  copy: "copy",
  copied: "copied",
  copyLabel: "Copy command",
  count: (n, total) => `${n} of ${total} questions`,
  permalink: "Link to this question",
});

// Per-locale content: { cats: { "<English category key>": "label" }, items: { "<id>": { q, a } } }.
// Anything a locale does not define falls back to the English content in data/faq.js.
const L = useT("faqItems", { cats: {}, items: {} });
const { localeIndex } = useData();

// Resolved items: translated content when the locale has it, English otherwise.
const items = computed(() =>
  EN.map((e) => {
    const o = L.items[e.id];
    return { id: e.id, cat: e.cat, q: o?.q ?? e.q, a: o?.a ?? e.a, tr: !!o };
  }),
);
const categories = [...new Set(EN.map((i) => i.cat))];
const catLabel = (c) => L.cats[c] ?? c;
const catTr = (c) => !!L.cats[c];
const query = ref("");
const cat = ref("");
const open = ref(new Set());
const { copy, isCopied } = useClipboard();

const text = (i) =>
  [i.q, ...i.a.flatMap((b) => (b.p ? [b.p] : b.ul ? b.ul : [b.code]))]
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase();
const index = computed(() => new Map(items.value.map((i) => [i.id, text(i)])));

const visible = computed(() => {
  const words = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return items.value.filter(
    (i) =>
      (!cat.value || i.cat === cat.value) && words.every((w) => index.value.get(i.id).includes(w)),
  );
});
const countFor = (c) => items.value.filter((i) => i.cat === c).length;

// Internal links stay inside the current language ("/it/downloads" for Italian).
const prefix = () =>
  localeIndex.value && localeIndex.value !== "root" ? "/" + localeIndex.value : "";
const html = (s) => s.replace(/href="(\/[^"]*)"/g, (_, p) => `href="${withBase(prefix() + p)}"`);

function toggle(id, e) {
  const next = new Set(open.value);
  if (e.target.open) next.add(id);
  else next.delete(id);
  open.value = next;
}
function openFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (EN.some((i) => i.id === id)) {
    open.value = new Set([...open.value, id]);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
  }
}
onMounted(() => {
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
});
</script>

<template>
  <div class="faq">
    <div class="search">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        v-model="query"
        type="search"
        :placeholder="UI.placeholder"
        :aria-label="UI.searchLabel"
      />
    </div>

    <div class="chips" role="group">
      <button type="button" :class="{ on: !cat }" :aria-pressed="!cat" @click="cat = ''">
        {{ UI.all }} <small>{{ items.length }}</small>
      </button>
      <button
        v-for="c in categories"
        :key="c"
        type="button"
        :dir="catTr(c) ? null : 'ltr'"
        :class="{ on: cat === c }"
        :aria-pressed="cat === c"
        @click="cat = cat === c ? '' : c"
      >
        {{ catLabel(c) }} <small>{{ countFor(c) }}</small>
      </button>
    </div>

    <p class="count" role="status">{{ UI.count(visible.length, items.length) }}</p>

    <div v-if="visible.length" class="list">
      <details
        v-for="i in visible"
        :id="i.id"
        :key="i.id"
        :open="open.has(i.id)"
        @toggle="toggle(i.id, $event)"
      >
        <summary>
          <span class="cat" :dir="catTr(i.cat) ? null : 'ltr'">{{ catLabel(i.cat) }}</span>
          <span class="q" :dir="i.tr ? null : 'ltr'" :lang="i.tr ? null : 'en'">{{ i.q }}</span>
          <a class="perma" :href="'#' + i.id" :aria-label="UI.permalink" @click.stop>#</a>
        </summary>
        <div class="answer" :dir="i.tr ? null : 'ltr'" :lang="i.tr ? null : 'en'">
          <template v-for="(b, n) in i.a" :key="n">
            <p v-if="b.p" v-html="html(b.p)" />
            <ul v-else-if="b.ul">
              <li v-for="(li, k) in b.ul" :key="k" v-html="html(li)" />
            </ul>
            <div v-else class="cmd">
              <pre><code>{{ b.code }}</code></pre>
              <button type="button" :aria-label="UI.copyLabel" @click="copy(b.code)">
                {{ isCopied(b.code) ? UI.copied : UI.copy }}
              </button>
            </div>
          </template>
        </div>
      </details>
    </div>
    <div v-else class="empty">
      <p>{{ UI.noResults }} “{{ query }}”.</p>
      <button
        type="button"
        @click="
          query = '';
          cat = '';
        "
      >
        {{ UI.clear }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.faq {
  margin-top: 16px;
}
.search {
  position: relative;
}
.search svg {
  position: absolute;
  inset-inline-start: 12px;
  top: 50%;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
  pointer-events: none;
}
.search input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px 10px 38px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font: 14px var(--vp-font-family-mono);
}
.search input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.chips {
  display: flex;
  gap: 8px;
  margin: 14px 0 6px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
}
.chips button {
  flex: none;
  padding: 5px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 99px;
  background: none;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
}
.chips button small {
  margin-inline-start: 4px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
}
.chips button:hover {
  border-color: var(--vp-c-brand-1);
}
.chips button.on {
  background: var(--ba-accent);
  border-color: var(--ba-accent);
  color: #fff;
}
.chips button.on small {
  color: rgba(255, 255, 255, 0.8);
}
.count {
  margin: 6px 0 14px;
  font: 12px var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
}
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
details {
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--ba-radius);
  background: var(--vp-c-bg-soft);
  transition: border-color 0.15s;
  scroll-margin-top: calc(var(--vp-nav-height) + 16px);
}
details:hover,
details[open] {
  border-color: var(--vp-c-brand-1);
}
details[open] {
  box-shadow: var(--ba-shadow);
}
summary {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  list-style: none;
}
summary::-webkit-details-marker {
  display: none;
}
summary::before {
  content: "+";
  flex: none;
  width: 14px;
  font: 600 16px var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
}
details[open] > summary::before {
  content: "−";
}
.cat {
  flex: none;
  font: 11px var(--vp-font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}
.q {
  flex: 1;
  font-weight: 600;
  line-height: 1.4;
}
.perma {
  flex: none;
  color: var(--vp-c-text-3);
  text-decoration: none;
  font-family: var(--vp-font-family-mono);
  opacity: 0;
  transition: opacity 0.15s;
}
summary:hover .perma,
.perma:focus-visible {
  opacity: 1;
}
.answer {
  padding: 0 16px 16px 42px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  font-size: 15px;
}
.answer :deep(p),
.answer :deep(ul) {
  margin: 0 0 12px;
}
.answer :deep(ul) {
  padding-inline-start: 20px;
}
.answer :deep(li) {
  margin-bottom: 6px;
}
.answer :deep(code) {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
}
.cmd {
  position: relative;
  margin: 0 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}
.cmd pre {
  margin: 0;
  padding: 12px 70px 12px 14px;
  overflow-x: auto;
}
.cmd code {
  font: 13px/1.6 var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  background: none;
  padding: 0;
  white-space: pre;
}
.cmd button {
  position: absolute;
  top: 8px;
  inset-inline-end: 8px;
  padding: 3px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font: 12px var(--vp-font-family-mono);
  cursor: pointer;
}
.cmd button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.empty {
  padding: 32px 16px;
  text-align: center;
  border: 1px dashed var(--vp-c-divider);
  border-radius: var(--ba-radius);
}
.empty button {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: none;
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.empty button:hover {
  border-color: var(--vp-c-brand-1);
}
@media (max-width: 640px) {
  summary {
    flex-wrap: wrap;
    gap: 4px 10px;
  }
  .cat {
    order: 3;
    flex-basis: 100%;
    padding-inline-start: 24px;
  }
  .answer {
    padding-inline-start: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  details,
  .perma {
    transition: none;
  }
}
</style>
