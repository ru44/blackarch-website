<script setup>
import { computed } from "vue";
import { useData } from "vitepress";
import { useSidebar } from "vitepress/theme";
import meta from "../../i18n/meta.json";

/**
 * Sidebar collapse controls.
 *
 *   variant "collapse": a row at the top of the sidebar that hides it.
 *   variant "expand":   an edge tab, visible only while the sidebar is hidden.
 *
 * Both toggle the `sidebar-collapsed` class on <html> (styled in
 * styles/layout.css). The state lives only in that class and is deliberately
 * not persisted, so a reload always brings the sidebar back.
 */
defineProps({ variant: { type: String, default: "collapse" } });

const { hasSidebar } = useSidebar();
const { lang } = useData();

const labelsByLang = Object.fromEntries(
  Object.values(meta).map((locale) => [locale.lang, locale.sidebar]),
);
const labels = computed(
  () => labelsByLang[lang.value] ?? { hide: "Hide sidebar", show: "Show sidebar" },
);

function setCollapsed(value) {
  document.documentElement.classList.toggle("sidebar-collapsed", value);
}
</script>

<template>
  <button
    v-if="variant === 'collapse'"
    type="button"
    class="sb-collapse"
    :aria-label="labels.hide"
    @click="setCollapsed(true)"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M16 10l-2 2 2 2" />
    </svg>
    <span>{{ labels.hide }}</span>
  </button>

  <button
    v-else-if="hasSidebar"
    type="button"
    class="sb-expand"
    :aria-label="labels.show"
    :title="labels.show"
    @click="setCollapsed(false)"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M14 10l2 2-2 2" />
    </svg>
  </button>
</template>

<style scoped>
.sb-collapse,
.sb-expand {
  display: none;
  align-items: center;
  cursor: pointer;
  color: var(--vp-c-text-2);
}

.sb-collapse svg,
.sb-expand svg {
  width: 18px;
  height: 18px;
  flex: none;
}

.sb-collapse {
  gap: 8px;
  width: 100%;
  margin: 16px 0 12px;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--ba-radius-sm);
  background: var(--vp-c-bg-soft);
  font-size: 13px;
}

.sb-collapse:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.sb-expand {
  position: fixed;
  top: calc(var(--vp-nav-height) + 14px);
  inset-inline-start: 0;
  z-index: 60;
  justify-content: center;
  width: 36px;
  height: 40px;
  border: 1px solid var(--vp-c-divider);
  border-inline-start: 0;
  border-start-end-radius: 10px;
  border-end-end-radius: 10px;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--ba-shadow);
}

.sb-expand:hover {
  color: var(--vp-c-brand-1);
}

/* The sidebar is only a fixed column from 960px; below that VitePress uses its own menu. */
@media (min-width: 960px) {
  .sb-collapse {
    display: flex;
  }
}
</style>

<!-- Global: the expand tab shows only while <html> is marked collapsed. -->
<style>
@media (min-width: 960px) {
  html.sidebar-collapsed .sb-expand {
    display: inline-flex;
  }
}
</style>
