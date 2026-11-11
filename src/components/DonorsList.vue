<script setup>
import { ref, computed } from "vue";
import { useT } from "../i18n/index.js";
import donors from "../data/donors.json";

const T = useT("supporters", {
  title: "Supporters",
  since: (n) => `${n} donations since January 2017`,
  top: "Top", recent: "Recent", search: "Search supporters…", more: "Show more", none: "No supporters match.",
});

// "20,00 USD" -> { n: 20, cur: "USD" }; dates like "02 December 2018"
const parsed = donors.map((d, i) => {
  const m = String(d.amount).match(/([\d.,]+)\s*([A-Za-z]{3})?/);
  const n = m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) || 0 : 0;
  return { ...d, i, n, cur: m?.[2] || "", t: Date.parse(d.date) || 0 };
});
const max = Math.max(...parsed.map((d) => d.n), 1);

const view = ref("top");
const q = ref("");
const shown = ref(12);

const sorted = computed(() =>
  [...parsed].sort((a, b) => (view.value === "top" ? b.n - a.n || b.t - a.t : b.t - a.t))
);
const list = computed(() => {
  const s = q.value.trim().toLowerCase();
  return s ? sorted.value.filter((d) => `${d.name} ${d.amount} ${d.date}`.toLowerCase().includes(s)) : sorted.value;
});
const podium = computed(() => (view.value === "top" && !q.value.trim() ? sorted.value.slice(0, 3) : []));
const rest = computed(() => (podium.value.length ? list.value.slice(3) : list.value));
// visual order of the podium: 2nd, 1st, 3rd
const podiumOrder = computed(() => [podium.value[1], podium.value[0], podium.value[2]].filter(Boolean));
const rankOf = (d) => sorted.value.findIndex((x) => x.i === d.i) + 1;
</script>

<template>
  <section class="wall">
    <div class="head">
      <h2>{{ T.title }}</h2>
      <span>{{ T.since(donors.length) }}</span>
    </div>

    <div class="bar">
      <div class="seg" role="tablist">
        <button role="tab" :aria-selected="view === 'top'" :class="{ on: view === 'top' }" @click="view = 'top'; shown = 12">{{ T.top }}</button>
        <button role="tab" :aria-selected="view === 'recent'" :class="{ on: view === 'recent' }" @click="view = 'recent'; shown = 12">{{ T.recent }}</button>
      </div>
      <input v-model="q" type="search" :placeholder="T.search" :aria-label="T.search" @input="shown = 12" />
    </div>

    <div v-if="podium.length" class="podium">
      <div v-for="d in podiumOrder" :key="d.i" class="step" :data-rank="rankOf(d)">
        <span class="medal">{{ rankOf(d) }}</span>
        <strong>{{ d.name }}</strong>
        <span class="amt">{{ d.amount }}</span>
        <small>{{ d.date }}</small>
        <div class="pillar" :style="{ '--h': rankOf(d) === 1 ? '84px' : rankOf(d) === 2 ? '60px' : '44px' }"></div>
      </div>
    </div>

    <ol class="rows" :start="podium.length ? 4 : 1">
      <li v-for="d in rest.slice(0, shown)" :key="d.i">
        <span class="rank" v-if="view === 'top'">{{ rankOf(d) }}</span>
        <div class="who">
          <a v-if="d.website" :href="d.website" target="_blank" rel="noopener noreferrer">{{ d.name }}</a>
          <strong v-else>{{ d.name }}</strong>
          <small>{{ d.date }}</small>
        </div>
        <div class="meter" aria-hidden="true"><i :style="{ width: Math.max(4, (d.n / max) * 100) + '%' }"></i></div>
        <span class="amt">{{ d.amount }}</span>
      </li>
    </ol>
    <button v-if="shown < rest.length" type="button" class="more" @click="shown += 12">{{ T.more }} ({{ rest.length - shown }})</button>
    <p v-if="!list.length" class="empty">{{ T.none }}</p>
  </section>
</template>

<style scoped>
.head { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
.head h2 { margin: 24px 0 12px; }
.head span { font: 12px var(--vp-font-family-mono); color: var(--vp-c-text-3); }
.bar { display: flex; gap: 10px; flex-wrap: wrap; }
.seg { display: inline-flex; border: 1px solid var(--vp-c-divider); border-radius: 8px; overflow: hidden; }
.seg button { padding: 0 16px; height: 40px; background: none; border: 0; color: var(--vp-c-text-2); cursor: pointer; font-weight: 600; }
.seg button.on { background: var(--ba-red); color: #fff; }
input { flex: 1; min-width: 180px; height: 40px; padding: 0 14px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font: 14px var(--vp-font-family-mono); }
input:focus { outline: none; border-color: var(--vp-c-brand-1); }

.podium { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: end; gap: 12px; margin: 24px 0 8px; }
.step { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2px; padding: 16px 8px 0; border: 1px solid var(--vp-c-divider); border-bottom: 0; border-radius: 12px 12px 0 0; background: var(--vp-c-bg-soft); overflow: hidden; }
.step[data-rank="1"] { border-color: var(--vp-c-brand-1); background: linear-gradient(180deg, var(--ba-red-soft), var(--vp-c-bg-soft)); }
.step strong { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.step small { font-size: 12px; color: var(--vp-c-text-3); }
.step .amt { font-size: 18px; }
.medal { width: 28px; height: 28px; margin-bottom: 4px; border-radius: 50%; display: grid; place-items: center; font: 700 13px var(--vp-font-family-mono); color: var(--vp-c-text-2); border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.step[data-rank="1"] .medal { background: var(--ba-red); border-color: var(--ba-red); color: #fff; }
.pillar { align-self: stretch; height: var(--h); margin: 12px -8px 0; background: repeating-linear-gradient(135deg, transparent 0 6px, var(--ba-red-soft) 6px 12px); border-top: 1px solid var(--vp-c-divider); }

.rows { list-style: none; margin: 0; padding: 0; border: 1px solid var(--vp-c-divider); border-radius: 12px; overflow: hidden; background: var(--vp-c-bg-soft); }
.podium + .rows { border-radius: 0 0 12px 12px; margin-top: 0; }
.rows:empty { display: none; }
.rows li { display: grid; grid-template-columns: 28px minmax(120px, 1.2fr) minmax(60px, 1fr) auto; align-items: center; gap: 14px; margin: 0; padding: 12px 16px; }
.rows li + li { border-top: 1px solid var(--vp-c-divider); }
.rows li:hover { background: var(--ba-red-soft); }
.rank { font: 600 13px var(--vp-font-family-mono); color: var(--vp-c-text-3); text-align: center; }
.who { display: flex; flex-direction: column; min-width: 0; }
.who strong, .who a { font-weight: 600; font-size: 14px; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.who small { font-size: 12px; color: var(--vp-c-text-3); }
.meter { height: 6px; border-radius: 99px; background: var(--vp-c-divider); overflow: hidden; }
.meter i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--ba-red), #ff6b6b); }
.amt { font: 600 13px var(--vp-font-family-mono); color: var(--vp-c-brand-1); white-space: nowrap; }
.rows:not(:has(.rank)) li { grid-template-columns: minmax(120px, 1.2fr) minmax(60px, 1fr) auto; }
.more { display: block; margin: 14px auto 0; padding: 8px 18px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); cursor: pointer; }
.more:hover { border-color: var(--vp-c-brand-1); }
.empty { color: var(--vp-c-text-2); }
@media (max-width: 560px) {
  .podium { gap: 6px; }
  .rows li { grid-template-columns: 24px 1fr auto; }
  .meter { display: none; }
  .rows:not(:has(.rank)) li { grid-template-columns: 1fr auto; }
}
</style>
