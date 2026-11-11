<script setup>
import { useClipboard } from "../composables/useClipboard.js";
import { useT } from "../i18n/index.js";
import images from "../data/images.json";

const MIRROR_URL = "https://ftp.halifax.rwth-aachen.de/blackarch/";
const TORRENT_URL = "https://blackarch.org/blackarch/torrent/";

// Descriptions and tags are listed in the same order as data/images.json.
const T = useT("iso", {
  released: "Released",
  size: "Size",
  download: "Download",
  torrent: "Torrent",
  copy: "copy",
  copied: "copied",
  tags: ["Recommended", "Minimal"],
  desc: [
    "XFCE desktop with a curated set of common tools and a GUI installer.",
    "Small boot image. Pick only what you need; requires internet.",
  ],
});

const { copy, isCopied } = useClipboard();
const torrentFor = (file) => `${TORRENT_URL}${file.split("/")[1]}.torrent`;
</script>

<template>
  <div class="cards">
    <article v-for="(i, n) in images" :key="i.name" :class="{ feat: i.featured }">
      <header>
        <h3>{{ i.name }}</h3>
        <span class="tag">{{ T.tags[n] }}</span>
      </header>
      <p>{{ T.desc[n] }}</p>
      <dl>
        <div>
          <dt>{{ T.released }}</dt>
          <dd>
            <time :datetime="i.released">{{ i.released }}</time>
          </dd>
        </div>
        <div>
          <dt>{{ T.size }}</dt>
          <dd>{{ i.size }}</dd>
        </div>
      </dl>
      <ul class="sums">
        <li v-for="(sum, algorithm) in i.checksums" :key="algorithm">
          <button type="button" class="sha" :title="`Copy ${algorithm} ${sum}`" @click="copy(sum)">
            <span>{{ algorithm }}</span>
            <code>{{ sum.slice(0, 12) }}…{{ sum.slice(-6) }}</code>
            <em>{{ isCopied(sum) ? T.copied : T.copy }}</em>
          </button>
        </li>
      </ul>
      <footer>
        <a class="dl" :href="MIRROR_URL + i.file">{{ T.download }}</a>
        <a class="tr" :href="torrentFor(i.file)">{{ T.torrent }}</a>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin: 20px 0;
}
article {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition:
    border-color 0.2s,
    transform 0.2s;
}
article:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
}
article.feat {
  border-color: var(--vp-c-brand-1);
  background: linear-gradient(180deg, var(--ba-accent-soft), var(--vp-c-bg-soft) 60%);
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
h3 {
  margin: 0;
  font-size: 20px;
  letter-spacing: -0.02em;
}
.tag {
  font: 11px var(--vp-font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 99px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}
.feat .tag {
  background: var(--ba-accent);
  border-color: var(--ba-accent);
  color: #fff;
}
p {
  margin: 0;
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
dl {
  display: flex;
  gap: 24px;
  margin: 0;
}
dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}
dd {
  margin: 0;
  font: 600 14px var(--vp-font-family-mono);
}
.sums {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sums li {
  margin: 0;
}

.sha span {
  flex: none;
  min-width: 62px;
  text-align: start;
}

.sha {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  font-size: 12px;
  direction: ltr;
  unicode-bidi: isolate;
  text-align: left;
}
.sha:hover {
  border-color: var(--vp-c-brand-1);
}
.sha code {
  flex: 1;
  text-align: left;
  background: none;
  padding: 0;
  font-size: 12px;
  color: var(--vp-c-text-1);
}
.sha em {
  font-style: normal;
  color: var(--vp-c-brand-1);
}
footer {
  display: flex;
  gap: 8px;
}
footer a {
  flex: 1;
  text-align: center;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}
.dl {
  background: var(--ba-accent);
  color: #fff;
}
.dl:hover {
  filter: brightness(1.15);
}
.tr {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}
.tr:hover {
  border-color: var(--vp-c-brand-1);
}
@media (prefers-reduced-motion: reduce) {
  article {
    transition: none;
  }
}
</style>
