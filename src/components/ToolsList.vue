<script setup>
import { ref, computed, onMounted } from "vue";
import { watchDebounced, useIntersectionObserver } from "@vueuse/core";

const emit = defineEmits(["update:total"]);
const modules = import.meta.glob("../data/tools/*.json");

const CHUNK_SIZE = 60;

const tools = ref([]);
const filteredTools = ref([]);
const searchInput = ref("");
const isLoading = ref(true);
const expandedTool = ref(null);
const visibleCount = ref(CHUNK_SIZE);
const scrollContainer = ref(null);
const sentinel = ref(null);

const visibleTools = computed(() =>
  filteredTools.value.slice(0, visibleCount.value)
);
const hasMore = computed(
  () => visibleCount.value < filteredTools.value.length
);

watchDebounced(searchInput, search, { debounce: 300 });

useIntersectionObserver(
  sentinel,
  ([entry]) => {
    if (entry?.isIntersecting && hasMore.value) {
      visibleCount.value += CHUNK_SIZE;
    }
  },
  { root: scrollContainer, rootMargin: "400px" }
);

onMounted(async () => {
  const allData = await Promise.all(
    Object.values(modules).map(async (load) => {
      const json = await load();
      return Array.isArray(json.default) ? json.default : [json.default];
    })
  );

  const flatData = allData.flat();
  const deduped = Array.from(
    new Map(flatData.map((tool) => [tool.name, tool])).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  tools.value = deduped;
  filteredTools.value = deduped;
  emit("update:total", tools.value.length);
  isLoading.value = false;
});

function search() {
  const query = searchInput.value.trim().toLowerCase();
  filteredTools.value = tools.value.filter(
    (tool) =>
      tool.name.toLowerCase().includes(query) ||
      tool.description?.toLowerCase().includes(query)
  );
  visibleCount.value = CHUNK_SIZE;
  scrollContainer.value?.scrollTo({ top: 0 });
}

function toggleExpand(toolName) {
  expandedTool.value = expandedTool.value === toolName ? null : toolName;
}

function clearSearch() {
  searchInput.value = "";
  search();
}
</script>

<template>
  <div>
    <div class="search-wrapper">
      <div class="input-wrapper">
        <span class="search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          v-model="searchInput"
          type="search"
          placeholder="Search by name or description…"
          class="input"
          aria-label="Search tools"
          @keydown.enter="search"
        />
        <button
          v-if="searchInput"
          @click="clearSearch"
          class="clear-btn"
          type="button"
          aria-label="Clear search"
          title="Clear"
        >
          ×
        </button>
      </div>
      <button @click="search" class="button" type="button">Search</button>
    </div>

    <p class="result-count" role="status">
      Showing <strong>{{ filteredTools.length }}</strong> of
      {{ tools.length }} tools
    </p>

    <div
      v-if="filteredTools.length"
      ref="scrollContainer"
      class="table-scroll"
      tabindex="0"
    >
      <table class="tools-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Description</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tool in visibleTools"
            :key="tool.name"
            @click="toggleExpand(tool.name)"
            class="tool-row"
          >
            <td data-label="Name" class="tool-name">{{ tool.name }}</td>
            <td data-label="Version" class="tool-version">
              {{ tool.version }}
            </td>
            <td data-label="Description" class="desktop-only">
              {{ tool.description }}
            </td>
            <td data-label="Website">
              <a
                v-if="tool.url"
                :href="tool.url"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
                >Link</a
              >
              <span v-else class="no-url" title="No website available">—</span>
            </td>
            <td
              v-if="expandedTool === tool.name"
              colspan="4"
              class="mobile-desc"
            >
              {{ tool.description }}
            </td>
          </tr>
        </tbody>
      </table>
      <div ref="sentinel" class="sentinel" aria-hidden="true"></div>
      <div v-if="hasMore" class="loading-more">Loading more tools…</div>
    </div>

    <div v-else-if="isLoading" class="spinner" role="status" aria-label="Loading tools"></div>
    <div v-else class="empty-state">
      <p>No tools match “{{ searchInput }}”.</p>
      <button class="button empty-clear" type="button" @click="clearSearch">
        Clear search
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.input-wrapper {
  position: relative;
  flex-grow: 1;
  display: flex;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.search-icon svg {
  display: block;
  width: 100%;
  height: 100%;
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 0.25rem;
}

.clear-btn:hover {
  color: var(--vp-c-brand-1);
}

.input {
  flex-grow: 1;
  width: 100%;
  min-width: 0;
  border-radius: 0.5rem 0 0 0.5rem;
  border-right: none;
  padding-left: 2.4rem;
  padding-right: 2rem;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.input::placeholder {
  color: var(--vp-c-text-3);
}

.input::-webkit-search-cancel-button {
  display: none;
}

.button {
  border-radius: 0 0.5rem 0.5rem 0;
  border-left: none;
  cursor: pointer;
  background-color: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  font-weight: 500;
  transition: background-color 0.2s ease;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.input,
.button {
  height: 2.5rem;
  font-size: 1rem;
  border: 1px solid var(--vp-c-divider);
}

.button {
  border-color: var(--vp-c-brand-3);
}

.button:hover {
  background-color: var(--vp-c-brand-2);
}

.input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px var(--vp-c-brand-1);
}

.button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.result-count {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.result-count strong {
  color: var(--vp-c-text-1);
}

/* Scroll container keeps the sticky header inside its own scrolling context
   instead of fighting the fixed site nav */
.table-scroll {
  max-height: 75vh;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  background: var(--vp-c-bg);
}

.table-scroll:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.tools-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.tools-table th,
.tools-table td {
  padding: 0.5rem 0.75rem;
  vertical-align: top;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tools-table th {
  position: sticky;
  top: 0;
  background-color: var(--vp-c-bg-soft);
  z-index: 1;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.tool-row:hover td {
  background-color: var(--vp-c-bg-soft);
}

.tool-name {
  font-family: var(--vp-font-family-mono);
  font-size: 0.875em;
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}

.tool-version {
  font-size: 0.875em;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-url {
  color: var(--vp-c-text-3);
}

.sentinel {
  height: 1px;
}

.loading-more {
  padding: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

/* Description shown inline on desktop; expansion row is a mobile-only affordance */
.mobile-desc {
  display: none;
}

/* Loading spinner */
.spinner {
  margin: 2rem auto;
  width: 3rem;
  height: 3rem;
  border: 5px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 2.5s;
  }
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--vp-c-text-2);
}

.empty-clear {
  border-radius: 0.5rem;
  border: none;
  margin-top: 0.5rem;
}

/* Responsive Mobile: Stack rows as cards, no horizontal scroll */
@media (max-width: 640px) {
  .table-scroll {
    border: none;
    background: transparent;
  }

  .tools-table,
  .tools-table thead,
  .tools-table tbody,
  .tools-table th,
  .tools-table td,
  .tools-table tr {
    display: block;
    width: 100%;
  }

  /* Hide header row on mobile */
  .tools-table thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .tools-table tr {
    margin-bottom: 1rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.5rem;
    padding: 0.75rem;
    background: var(--vp-c-bg-soft);
  }

  .tools-table td {
    border: none;
    padding: 0.35rem 0 0.35rem 42%;
    position: relative;
    text-align: left;
    font-size: 0.9em;
    white-space: normal;
  }

  .tool-row:hover td {
    background-color: transparent;
  }

  .tools-table td::before {
    position: absolute;
    top: 0.35rem;
    left: 0;
    width: 38%;
    padding-right: 0.5rem;
    white-space: nowrap;
    font-weight: 600;
    color: var(--vp-c-text-2);
    content: attr(data-label);
  }

  .desktop-only {
    display: none !important;
  }

  .mobile-desc {
    display: block;
    padding: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    border-radius: 0.375rem;
    background-color: var(--vp-c-bg);
    color: var(--vp-c-text-1);
  }

  .mobile-desc::before {
    display: none;
  }

  .tool-row {
    cursor: pointer;
  }
}
</style>
