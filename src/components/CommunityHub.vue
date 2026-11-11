<script setup>
import { useT } from "../i18n/index.js";
const channels = [
  { n: "Matrix", d: "Best place to ask for help. Real-time chat with users and the team.", l: "https://matrix.to/#/#BlackArch:matrix.org", a: "#BlackArch:matrix.org", i: "M4 5h16v11H9l-5 4zM8 9h8M8 12h5" },
  { n: "GitHub", d: "All code, build scripts and site source. Issues and pull requests of any size are welcome.", l: "https://github.com/BlackArch", a: "github.com/BlackArch", i: "M9 19c-4 1-4-2-6-2m12 4v-3a3 3 0 0 0-1-2c3 0 6-1 6-6a5 5 0 0 0-1-3 5 5 0 0 0 0-3s-1 0-3 1a10 10 0 0 0-6 0c-2-1-3-1-3-1a5 5 0 0 0 0 3 5 5 0 0 0-1 3c0 5 3 6 6 6a3 3 0 0 0-1 2v3" },
  { n: "X", d: "New tools, new mirrors and major project changes. Mention us for bugs and suggestions.", l: "https://x.com/BlackArchLinux", a: "@BlackArchLinux", i: "M4 4l16 16M20 4L4 20" },
  { n: "YouTube", d: "Self-made videos on installation, configuration and major tool usage.", l: "https://www.youtube.com/channel/UChw5hByy70ey2F7QeLEGICQ", a: "BlackArch channel", i: "M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9l5 3-5 3z" },
  { n: "RSS", d: "Follow the news feed in your reader.", l: "https://blackarch.org/rss.xml", a: "blackarch.org/rss.xml", i: "M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8M6 19h.01" },
  { n: "Email", d: "Contact the core development team directly.", l: "mailto:team@blackarch.org", a: "team@blackarch.org", i: "M3 6h18v12H3zM3 7l9 7 9-7" },
];
const updateLinks = [
  "https://github.com/BlackArch/blackarch/issues",
  "https://github.com/BlackArch/blackarch/pulls",
  "https://blackarch.org/rss.xml",
];
const T = useT("community", {
  channels: [
    { d: "Best place to ask for help. Real-time chat with users and the team." },
    { d: "All code, build scripts and site source. Issues and pull requests of any size are welcome." },
    { d: "New tools, new mirrors and major project changes. Mention us for bugs and suggestions." },
    { d: "Self-made videos on installation, configuration and major tool usage." },
    { d: "Follow the news feed in your reader." },
    { d: "Contact the core development team directly." },
  ],
  newsTitle: "News & updates",
  lead: "We are always working on new features and improvements. Here is where to follow them live.",
  updates: [
    { t: "Issue tracker", d: "Bug reports and tool requests are tracked and answered here." },
    { t: "Pull requests", d: "See what is being packaged, updated and released right now." },
    { t: "Announcements", d: "News is posted on Matrix, YouTube and X. Subscribe via the RSS feed too." },
  ],
});
</script>

<template>
  <div>
    <div class="grid">
      <a v-for="(c, i) in channels" :key="c.n" :href="c.l" target="_blank" rel="noopener noreferrer" class="card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="c.i" /></svg>
        <h3>{{ c.n }}</h3>
        <p>{{ T.channels[i].d }}</p>
        <code>{{ c.a }}</code>
      </a>
    </div>

    <h2 id="news">{{ T.newsTitle }}</h2>
    <p class="lead">{{ T.lead }}</p>
    <ol class="timeline">
      <li v-for="(u, i) in T.updates" :key="i">
        <a :href="updateLinks[i]" target="_blank" rel="noopener noreferrer"><strong>{{ u.t }}</strong><span>{{ u.d }}</span></a>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; margin: 20px 0 8px; }
.card { display: flex; flex-direction: column; gap: 8px; padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); text-decoration: none; color: inherit; transition: border-color .2s, transform .2s; }
.card:hover { border-color: var(--vp-c-brand-1); transform: translateY(-3px); }
.card svg { width: 26px; height: 26px; color: var(--vp-c-brand-1); }
.card h3 { margin: 4px 0 0; font-size: 17px; }
.card p { margin: 0; flex: 1; font-size: 13.5px; line-height: 1.6; color: var(--vp-c-text-2); }
.card code { align-self: flex-start; font-size: 12px; background: none; padding: 0; color: var(--vp-c-brand-1); }
.lead { color: var(--vp-c-text-2); }
.timeline { list-style: none; margin: 20px 0; padding: 0 0 0 20px; border-left: 2px solid var(--vp-c-divider); }
.timeline li { position: relative; margin: 0 0 14px; padding: 0; }
.timeline li::before { content: ""; position: absolute; left: -27px; top: 14px; width: 12px; height: 12px; border-radius: 50%; background: var(--vp-c-bg); border: 2px solid var(--ba-red); }
.timeline a { display: flex; flex-direction: column; gap: 2px; padding: 10px 14px; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-soft); text-decoration: none; color: inherit; }
.timeline a:hover { border-color: var(--vp-c-brand-1); }
.timeline span { font-size: 13.5px; color: var(--vp-c-text-2); }
@media (prefers-reduced-motion: reduce) { .card { transition: none; } }
</style>
