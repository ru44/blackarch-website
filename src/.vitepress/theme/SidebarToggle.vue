<script setup>
import { ref, onMounted } from "vue";
import { useSidebar } from "vitepress/theme";

const { hasSidebar } = useSidebar();

// variant "collapse": row at the top of the sidebar. variant "expand": tab on the
// screen edge, only visible while the sidebar is collapsed. The state is shared at
// module level and is deliberately NOT persisted: a reload always shows the
// sidebar again, so it can never get stuck hidden.
defineProps({ variant: { type: String, default: "collapse" } });

const collapsed = shared();
function shared() {
  return (globalThis.__baSidebar ??= ref(false));
}
function apply() {
  document.documentElement.classList.toggle("sidebar-collapsed", collapsed.value);
}
function set(v) {
  collapsed.value = v;
  apply();
}
onMounted(() => {
  try { localStorage.removeItem("ba-sidebar-collapsed"); } catch {}
  apply();
});
</script>

<template>
  <button
    v-if="variant === 'collapse'"
    type="button"
    class="sb-collapse"
    aria-label="Hide sidebar"
    @click="set(true)"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M16 10l-2 2 2 2" />
    </svg>
    <span>Hide sidebar</span>
  </button>
  <button
    v-else-if="hasSidebar"
    type="button"
    class="sb-expand"
    aria-label="Show sidebar"
    title="Show sidebar"
    @click="set(false)"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M14 10l2 2-2 2" />
    </svg>
  </button>
</template>

<style scoped>
.sb-collapse {
  display: none;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin: 0 0 12px;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
}
.sb-collapse:hover { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }
.sb-collapse svg, .sb-expand svg { width: 18px; height: 18px; flex: none; }
.sb-expand {
  display: none;
  position: fixed;
  top: calc(var(--vp-nav-height) + 14px);
  left: 0;
  z-index: 60;
  width: 36px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  border-left: 0;
  border-radius: 0 10px 10px 0;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  cursor: pointer;
  box-shadow: var(--ba-shadow);
}
.sb-expand:hover { color: var(--vp-c-brand-1); }
@media (min-width: 960px) {
  .sb-collapse { display: flex; }
}
@media (prefers-reduced-motion: reduce) { .sb-collapse, .sb-expand { transition: none; } }
</style>
