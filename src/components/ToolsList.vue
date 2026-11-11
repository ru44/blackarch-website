<script setup>
import { useClipboard } from "../composables/useClipboard.js";
import { useT } from "../i18n/index.js";
import { ref, computed, watch, onMounted } from "vue";
import { watchDebounced, useIntersectionObserver } from "@vueuse/core";

const UI = useT("tools", {
  placeholder: "Search by name or description…",
  searchLabel: "Search tools",
  clear: "Clear search",
  all: "All",
  showing: "Showing",
  of: "of",
  tools: "tools",
  loading: "Loading tools…",
  loadingLabel: "Loading tools",
  noMatch: "No tools match",
  clearFilters: "Clear filters",
  name: "Name",
  version: "Version",
  description: "Description",
  category: "Category",
  website: "Website",
  visit: "Visit website",
  noSite: "No website listed",
  deadLink: "Dead link",
  searchFor: (name) => `Search for ${name}`,
  install: "Install",
  copy: "copy",
  copied: "copied",
  copyAria: (n) => `Copy install command for ${n}`,
  expandAria: (n) => `Show details for ${n}`,
  filterLabel: "Filter by category",
  sortLabel: "Sort tools",
  sortName: "A–Z",
  sortTop: "Most popular",
  sortUpdated: "Recently updated",
  topNote: "Ranked by the GitHub stars of each tool's upstream repository.",
  updated: "Updated",
  stars: "Stars",
  moreCategories: (n) => `${n} more`,
  fewerCategories: "Show fewer",
});

const modules = import.meta.glob("../data/tools/*.json");
const CHUNK_SIZE = 60;
// Categories shown before the "more" button; selected ones are always shown.
const VISIBLE_CATEGORIES = 12;

const tools = ref([]);
const searchInput = ref("");
const query = ref("");
// Selected categories. A tool matches when it is in any of them.
const selected = ref(new Set());
const showAllCategories = ref(false);
// "name" (A–Z), "top" (most GitHub stars first) or "updated" (newest build first).
// In both orderings, tools without that value sort to the bottom.
const sort = ref("name");
const isLoading = ref(true);
const expanded = ref(null);
const { copy: writeClipboard, isCopied } = useClipboard();
const visibleCount = ref(CHUNK_SIZE);
const scrollContainer = ref(null);
const sentinel = ref(null);

// Groups are stored without their "blackarch-" prefix: "code-audit" -> "code audit".
const label = (group) => group.replace(/-/g, " ");
const groupCmd = (group) => `sudo pacman -S blackarch-${group}`;
const docs = ref(new Set());
// Tools whose website no longer exists (see scripts/sync-tool-links.mjs).
const deadLinks = ref(new Set());
// A page cannot open the visitor's default search engine, so the link goes to Google.
const searchUrl = (tool) =>
  `https://www.google.com/search?q=${encodeURIComponent(`${tool.name} ${tool.description ?? ""}`.slice(0, 120))}`;
const installCmd = (name) => `sudo pacman -S ${name}`;

const categories = computed(() => {
  const counts = new Map();
  for (const t of tools.value) for (const g of t.groups) counts.set(g, (counts.get(g) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
});

const visibleCategories = computed(() =>
  showAllCategories.value
    ? categories.value
    : categories.value.filter(([group], i) => i < VISIBLE_CATEGORIES || selected.value.has(group)),
);
const hiddenCategoryCount = computed(
  () => categories.value.length - visibleCategories.value.length,
);

const filteredTools = computed(() => {
  const q = query.value.trim().toLowerCase();
  const matches = tools.value.filter(
    (t) =>
      (!selected.value.size || t.groups.some((group) => selected.value.has(group))) &&
      (!q || t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)),
  );
  if (sort.value === "top") {
    return [...matches].sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
  }
  if (sort.value === "updated") {
    // ISO dates sort as text, so a missing date ("") ends up last.
    return [...matches].sort((a, b) => (b.updated ?? "").localeCompare(a.updated ?? ""));
  }
  return matches;
});

const formatStars = (count) => (count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count));
// Second column: version by default, or the value the list is sorted by.
const columnLabel = computed(
  () => ({ top: UI.stars, updated: UI.updated })[sort.value] ?? UI.version,
);
function columnValue(tool) {
  if (sort.value === "top") return tool.rank ? `#${tool.rank} · ${formatStars(tool.stars)}` : "—";
  if (sort.value === "updated") return tool.updated ?? "—";
  return tool.version;
}
const visibleTools = computed(() => filteredTools.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < filteredTools.value.length);

watchDebounced(searchInput, (v) => (query.value = v), { debounce: 250 });
watch([query, selected, sort], () => {
  visibleCount.value = CHUNK_SIZE;
  expanded.value = null;
  scrollContainer.value?.scrollTo({ top: 0 });
});

useIntersectionObserver(
  sentinel,
  ([entry]) => {
    if (entry?.isIntersecting && hasMore.value) visibleCount.value += CHUNK_SIZE;
  },
  { root: scrollContainer, rootMargin: "400px" },
);

onMounted(async () => {
  // One file per category (see scripts/sync-tools.mjs), loaded in parallel.
  const [categoryFiles, { default: docList }, { default: stars }, { default: deadList }] =
    await Promise.all([
      Promise.all(Object.values(modules).map((load) => load())),
      import("../data/tool-docs.json"),
      import("../data/tool-stars.json"),
      import("../data/tool-dead-links.json"),
    ]);
  docs.value = new Set(docList);
  deadLinks.value = new Set(deadList);
  // tool-stars.json is ordered most starred first, so the position is the rank.
  const ranks = new Map(Object.keys(stars).map((name, i) => [name, i + 1]));

  tools.value = categoryFiles
    .flatMap((file) => file.default)
    .map((tool) => ({ ...tool, stars: stars[tool.name], rank: ranks.get(tool.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  isLoading.value = false;
});

function toggle(name) {
  expanded.value = expanded.value === name ? null : name;
}
function toggleCategory(group) {
  const next = new Set(selected.value);
  if (next.has(group)) next.delete(group);
  else next.add(group);
  selected.value = next;
}
function clearAll() {
  searchInput.value = "";
  query.value = "";
  selected.value = new Set();
}
function copy(name, event) {
  event?.stopPropagation();
  writeClipboard(installCmd(name), name);
}
</script>

<template>
  <div class="tools">
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
        v-model="searchInput"
        type="search"
        class="input"
        :placeholder="UI.placeholder"
        :aria-label="UI.searchLabel"
        @keydown.enter="query = searchInput"
      />
      <button
        v-if="searchInput"
        type="button"
        class="clear"
        :aria-label="UI.clear"
        @click="
          searchInput = '';
          query = '';
        "
      >
        ×
      </button>
    </div>

    <div class="sort" role="group" :aria-label="UI.sortLabel">
      <button
        v-for="[value, text] in [
          ['name', UI.sortName],
          ['top', UI.sortTop],
          ['updated', UI.sortUpdated],
        ]"
        :key="value"
        type="button"
        :class="{ on: sort === value }"
        :aria-pressed="sort === value"
        @click="sort = value"
      >
        {{ text }}
      </button>
    </div>

    <div class="chips" role="group" :aria-label="UI.filterLabel">
      <button
        type="button"
        :class="{ on: !selected.size }"
        :aria-pressed="!selected.size"
        @click="selected = new Set()"
      >
        {{ UI.all }} <small>{{ tools.length }}</small>
      </button>
      <button
        v-for="[group, count] in visibleCategories"
        :key="group"
        type="button"
        :class="{ on: selected.has(group) }"
        :aria-pressed="selected.has(group)"
        @click="toggleCategory(group)"
      >
        {{ label(group) }} <small>{{ count }}</small>
      </button>
      <button
        v-if="hiddenCategoryCount || showAllCategories"
        type="button"
        class="more"
        :aria-expanded="showAllCategories"
        @click="showAllCategories = !showAllCategories"
      >
        {{ showAllCategories ? UI.fewerCategories : UI.moreCategories(hiddenCategoryCount) }}
      </button>
    </div>

    <p class="result-count" role="status">
      {{ UI.showing }} <strong>{{ filteredTools.length }}</strong> {{ UI.of }} {{ tools.length }}
      {{ UI.tools }}
      <span v-if="sort === 'top'" class="note">{{ UI.topNote }}</span>
    </p>

    <div v-if="filteredTools.length" ref="scrollContainer" class="table-scroll" tabindex="0">
      <div class="head" aria-hidden="true">
        <span>{{ UI.name }}</span
        ><span>{{ columnLabel }}</span
        ><span>{{ UI.description }}</span
        ><span />
      </div>
      <ul class="rows">
        <li
          v-for="tool in visibleTools"
          :key="tool.name"
          class="row"
          :class="{ open: expanded === tool.name }"
        >
          <div class="line">
            <button
              type="button"
              class="expand"
              :aria-expanded="expanded === tool.name"
              :aria-controls="'p-' + tool.name"
              :aria-label="UI.expandAria(tool.name)"
              @click="toggle(tool.name)"
            >
              <span class="chev" aria-hidden="true" />
              <span class="tool-name">{{ tool.name }}</span>
              <span class="tool-version">{{ columnValue(tool) }}</span>
              <span class="desc" dir="ltr" lang="en">{{ tool.description }}</span>
            </button>
            <button
              type="button"
              class="copy-icon"
              :class="{ done: isCopied(tool.name) }"
              :aria-label="UI.copyAria(tool.name)"
              :title="installCmd(tool.name)"
              @click="copy(tool.name, $event)"
            >
              <svg
                v-if="!isCopied(tool.name)"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15V6a2 2 0 0 1 2-2h9" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </button>
          </div>
          <div v-if="expanded === tool.name" :id="'p-' + tool.name" class="panel">
            <p class="full" dir="ltr" lang="en">{{ tool.description }}</p>
            <dl>
              <div>
                <dt>{{ UI.version }}</dt>
                <dd>{{ tool.version }}</dd>
              </div>
              <div v-if="tool.updated">
                <dt>{{ UI.updated }}</dt>
                <dd>
                  <time :datetime="tool.updated">{{ tool.updated }}</time>
                </dd>
              </div>
              <div v-if="tool.stars">
                <dt>{{ UI.stars }}</dt>
                <dd>{{ tool.stars.toLocaleString("en") }}</dd>
              </div>
              <div v-if="docs.has(tool.name)">
                <dt>Wiki</dt>
                <dd>
                  <a
                    :href="`https://blackarch.wiki/tools/${tool.name}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Docs on blackarch.wiki</a
                  >
                </dd>
              </div>
              <div>
                <dt>{{ UI.website }}</dt>
                <dd>
                  <template v-if="tool.url && !deadLinks.has(tool.name)">
                    <a :href="tool.url" target="_blank" rel="noopener noreferrer">{{ UI.visit }}</a>
                  </template>
                  <template v-else>
                    <span v-if="tool.url" class="dead-tag" :title="tool.url">{{
                      UI.deadLink
                    }}</span>
                    <span v-else class="no-url">{{ UI.noSite }}</span>
                    <a :href="searchUrl(tool)" target="_blank" rel="noopener noreferrer">{{
                      UI.searchFor(tool.name)
                    }}</a>
                  </template>
                </dd>
              </div>
            </dl>
            <div v-if="tool.groups.length" class="groups">
              <span class="lbl">{{ UI.category }}</span>
              <button
                v-for="g in tool.groups"
                :key="g"
                type="button"
                :class="{ on: selected.has(g) }"
                :title="groupCmd(g)"
                @click="toggleCategory(g)"
              >
                {{ label(g) }}
              </button>
            </div>
            <div class="cmd">
              <span class="lbl">{{ UI.install }}</span>
              <code><b>$</b> {{ installCmd(tool.name) }}</code>
              <button type="button" @click="copy(tool.name)">
                {{ isCopied(tool.name) ? UI.copied : UI.copy }}
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div ref="sentinel" class="sentinel" aria-hidden="true"></div>
      <div v-if="hasMore" class="loading-more">{{ UI.loading }}</div>
    </div>

    <div v-else-if="isLoading" class="spinner" role="status" :aria-label="UI.loadingLabel"></div>
    <div v-else class="empty-state">
      <p>{{ UI.noMatch }} “{{ searchInput }}”.</p>
      <button class="empty-clear" type="button" @click="clearAll">{{ UI.clearFilters }}</button>
    </div>
  </div>
</template>

<style scoped>
.search {
  position: relative;
  display: flex;
  margin: 1rem 0 0.75rem;
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
.input {
  flex: 1;
  box-sizing: border-box;
  padding: 10px 36px 10px 38px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font: 14px var(--vp-font-family-mono);
}
.input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.input::-webkit-search-cancel-button {
  display: none;
}
.clear {
  position: absolute;
  inset-inline-end: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--vp-c-text-3);
  font-size: 18px;
  cursor: pointer;
}
.clear:hover {
  color: var(--vp-c-brand-1);
}

.sort {
  display: inline-flex;
  margin-bottom: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--ba-radius-sm);
  overflow: hidden;
}

.sort button {
  padding: 6px 14px;
  border: 0;
  background: none;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.sort button + button {
  border-inline-start: 1px solid var(--vp-c-divider);
}

.sort button.on {
  background: var(--ba-accent);
  color: #fff;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chips button.more {
  border-style: dashed;
  color: var(--vp-c-brand-1);
}

.result-count .note {
  margin-inline-start: 8px;
  color: var(--vp-c-text-3);
}

.chips button {
  flex: none;
  padding: 4px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 99px;
  background: none;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  text-transform: capitalize;
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

.result-count {
  margin: 8px 0 10px;
  font: 12px var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
}
.result-count strong {
  color: var(--vp-c-brand-1);
}

.table-scroll {
  max-height: 75vh;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--ba-radius);
  background: var(--vp-c-bg-soft);
  box-shadow: var(--ba-shadow);
}
.table-scroll:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.head,
.expand {
  display: grid;
  grid-template-columns: 16px minmax(120px, 1.1fr) minmax(80px, 0.7fr) minmax(0, 3fr);
  gap: 12px;
  align-items: start;
}
.head {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 9px 56px 9px 14px;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-brand-1);
  font: 600 11px var(--vp-font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}
.head span:first-child {
  grid-column: 2;
}
.head span:nth-child(1) {
  grid-column: 2;
}
.head span:nth-child(2) {
  grid-column: 3;
}
.head span:nth-child(3) {
  grid-column: 4;
}
.head span:nth-child(4) {
  display: none;
}

.rows {
  list-style: none;
  margin: 0;
  padding: 0;
}
.row {
  margin: 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.row:last-child {
  border-bottom: 0;
}
.line {
  position: relative;
}
.expand {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 56px 10px 14px;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  box-shadow: inset 2px 0 0 transparent;
  transition:
    background 0.12s,
    box-shadow 0.12s;
}
.expand:hover,
.row.open .expand {
  background: var(--ba-accent-soft);
  box-shadow: inset 2px 0 0 var(--ba-accent);
}
.expand:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}
.chev {
  width: 7px;
  height: 7px;
  margin-top: 7px;
  border-inline-end: 2px solid var(--vp-c-text-3);
  border-bottom: 2px solid var(--vp-c-text-3);
  transform: rotate(-45deg);
  transition: transform 0.15s;
}
.row.open .chev {
  transform: rotate(45deg);
  border-color: var(--vp-c-brand-1);
}
.tool-name {
  font: 600 14px var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
  overflow-wrap: anywhere;
}
.tool-version {
  font: 12px var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  padding-top: 2px;
  overflow-wrap: anywhere;
}
.desc {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.copy-icon {
  position: absolute;
  inset-inline-end: 12px;
  top: 8px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.copy-icon svg {
  width: 15px;
  height: 15px;
}
.copy-icon:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.copy-icon.done {
  border-color: var(--ba-accent);
  color: var(--ba-accent);
}

.panel {
  padding: 4px 56px 16px 42px;
  background: var(--vp-c-bg);
  border-top: 1px dashed var(--vp-c-divider);
}
.full {
  margin: 12px 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--vp-c-text-1);
}
dl {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;
  margin: 0 0 14px;
}
dt {
  font: 11px var(--vp-font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}
dd {
  margin: 2px 0 0;
  font-size: 13.5px;
  text-transform: capitalize;
}
dd a {
  text-transform: none;
}
.dead-tag {
  margin-inline-end: 8px;
  padding: 1px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 99px;
  font: 11px var(--vp-font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}

.no-url {
  margin-inline-end: 8px;
  color: var(--vp-c-text-3);
  text-transform: none;
}
.cmd {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
.lbl {
  flex: none;
  font: 11px var(--vp-font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}
.cmd code {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
  background: none;
  padding: 0;
  font: 13px var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}
.cmd b {
  color: var(--ba-accent);
  margin-inline-end: 6px;
}
.cmd button {
  flex: none;
  padding: 3px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font: 12px var(--vp-font-family-mono);
  cursor: pointer;
}
.cmd button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.sentinel {
  height: 1px;
}
.loading-more {
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
.spinner {
  width: 28px;
  height: 28px;
  margin: 40px auto;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.empty-state {
  padding: 32px 16px;
  text-align: center;
  border: 1px dashed var(--vp-c-divider);
  border-radius: var(--ba-radius);
  color: var(--vp-c-text-2);
}
.empty-clear {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: none;
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.empty-clear:hover {
  border-color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .head {
    display: none;
  }
  .table-scroll {
    border: 1px solid var(--vp-c-divider);
  }
  .expand {
    grid-template-columns: 14px 1fr;
    gap: 2px 10px;
    padding-inline-end: 52px;
  }
  .expand .chev {
    grid-row: 1 / span 3;
  }
  .tool-name,
  .tool-version,
  .desc {
    grid-column: 2;
  }
  .panel {
    padding: 4px 14px 14px;
  }
  .cmd {
    flex-wrap: wrap;
  }
  .cmd code {
    flex-basis: 100%;
    order: 3;
  }
}
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
  .expand,
  .chev {
    transition: none;
  }
}

.groups {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 10px 0;
}
.groups .lbl {
  font: 11px var(--vp-font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
  margin-inline-end: 4px;
}
.groups button {
  font: 12px var(--vp-font-family-mono);
  padding: 2px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 99px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.groups button:hover,
.groups button.on {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.desc,
.full {
  text-align: left;
}
</style>
