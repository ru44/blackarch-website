<script setup>
import { computed, ref } from "vue";
import { useT } from "../i18n/index.js";
import shots from "../data/screenshots.json";

const BASE_URL = "https://blackarch.org/images/screenshots/";

const T = useT("shots", {
  title: "See it running",
  aria: "BlackArch screenshots",
});

const index = ref(0);
const current = computed(() => shots[index.value]);
const fullUrl = (shot) => `${BASE_URL}${shot.image}`;
const thumbUrl = (shot) => `${BASE_URL}thumbnails/${shot.thumb}`;
</script>

<template>
  <section class="show" :aria-label="T.aria">
    <h2>{{ T.title }}</h2>

    <div class="window">
      <div class="bar">
        <i /><i /><i /><span>{{ current.label }}</span>
      </div>
      <a :href="fullUrl(current)" target="_blank" rel="noopener" class="view">
        <img
          :key="current.id"
          :src="fullUrl(current)"
          :alt="`BlackArch ${current.label} screenshot`"
        />
      </a>
    </div>

    <div class="strip">
      <button
        v-for="(shot, i) in shots"
        :key="shot.id"
        :class="{ on: i === index }"
        :aria-label="shot.label"
        :aria-current="i === index"
        @click="index = i"
      >
        <img :src="thumbUrl(shot)" :alt="shot.label" loading="lazy" />
        <span>{{ shot.label }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.show {
  max-width: 1152px;
  margin: 64px auto 0;
  padding: 0 24px;
}
h2 {
  margin: 0 0 16px;
  border: 0;
  padding: 0;
  font-size: 24px;
}
.window {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  box-shadow:
    0 24px 60px -24px rgba(230, 0, 0, 0.35),
    var(--ba-shadow);
}
.bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  background: #17171a;
  border-bottom: 1px solid #26262b;
}
.bar i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3a3a40;
}
.bar i:first-child {
  background: #e60000;
}
.bar span {
  margin-inline-start: 10px;
  font: 12px var(--vp-font-family-mono);
  color: #8a8a93;
}
.view {
  display: block;
  aspect-ratio: 16 / 9;
  background: #000;
}
.view img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border: 0;
  border-radius: 0;
  animation: fade 0.3s ease;
}
.strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 12px;
}
.strip button {
  padding: 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  opacity: 0.65;
  transition:
    opacity 0.15s,
    border-color 0.15s;
}
.strip button:hover,
.strip button.on {
  opacity: 1;
}
.strip button.on {
  border-color: var(--vp-c-brand-1);
}
.strip img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border: 0;
  border-radius: 0;
}
.strip span {
  display: block;
  padding: 5px 8px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .view img {
    animation: none;
  }
}
</style>
