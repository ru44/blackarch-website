<script setup>
import { useT } from "../i18n/index.js";
import { ref, computed, onMounted } from "vue";
import { withBase } from "vitepress";

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

const matrix = '<a href="https://matrix.to/#/#BlackArch:matrix.org">Matrix channel</a>';

// Answer blocks: p (html string), ul (array of html strings), code (string).
// Internal links are written as href="/path" and resolved with the site base.
const items = [
  {
    id: "right-distro",
    cat: "Getting started",
    q: "Is BlackArch Linux the right pentesting distribution for me?",
    a: [
      { p: "BlackArch is a Linux pentesting distribution based on ArchLinux. If you're not familiar with ArchLinux, or Linux in general, we strongly suggest you avoid BlackArch due to the learning curve for new users." },
    ],
  },
  {
    id: "where-to-start",
    cat: "Getting started",
    q: "Where do I start with BlackArch?",
    a: [
      { p: `You must first get an ISO on the <a href="/downloads">downloads page</a> and install it by following the instructions of the installation script. You can find a tutorial showing the process step by step on the <a href="/install">installation page</a>. If you encounter any problems and need help, the best place to ask is our ${matrix}.` },
    ],
  },
  {
    id: "up-to-date",
    cat: "Updates",
    q: "Is BlackArch up to date?",
    a: [
      { p: "BlackArch is constantly being updated and offers the latest packages available on Github. We release a new ISO four times a year (quarterly). These new images contain packages that are up to date, and usually include bug fixes. If you find any package that is outdated and wish to see it up to date, please report it as an issue on our Github repository." },
    ],
  },
  {
    id: "install-updates",
    cat: "Updates",
    q: "How can I fetch/install the latest update available?",
    a: [
      { p: "By simply running pacman" },
      { code: "sudo pacman -Syu --needed --overwrite='*' blackarch" },
      { p: "This command requires root privileges." },
    ],
  },
  {
    id: "keyring-signature",
    cat: "Troubleshooting",
    q: "Why do I get invalid keyring signature?",
    a: [
      { p: "It could happen for a wide range of reasons. Below you will find a few suggestions." },
      {
        ul: [
          "You don't have an internet connection (as you can imagine, a rare problem and can be verified quickly).",
          "You may have a DNS problem, that can't resolve pgp.mit.edu accordingly. Please check your DNS settings (pgp.mit.edu works best with 8.8.8.8 DNS Server).",
          "You may have a network issue, different from the above one, which is hard for us to help since it can be a myriad of things. For example: DNS caching.",
          "You may have a clock/time issue.",
          "You may have something blocking your communication with mit.edu server, for instance: a firewall.",
          "If you're connected through a VPN, try to temporarily disable it and run <code>strap.sh</code> again.",
        ],
      },
      { p: "After testing all the items described above if you still have problems using <code>strap.sh</code>, try the options below:" },
      { p: "<strong>1st option:</strong>" },
      { code: "sudo rm -rf /etc/pacman.d/gnupg\nsudo pacman-key --init\nsudo pacman-key --populate archlinux blackarch\nsudo pacman-key --update --keyserver keyserver.ubuntu.com" },
      { p: "<strong>2nd option:</strong> You could try to change to pgp.mit.edu's IP address using the following command:" },
      { code: "curl -O https://blackarch.org/strap.sh\nchmod +x strap.sh\nsha1sum strap.sh # it should match the SHA1 sum on the downloads page\nsudo sh strap.sh" },
      { p: "<strong>3rd option:</strong> You could try to temporarily switch to another mirror:" },
      { code: "sudoedit /etc/pacman.d/blackarch-mirrorlist" },
      { p: `It's very important to follow the suggestions above as well as checking the Archlinux Wiki pages to assist you as needed. If you still encounter any problems, pay us a visit at <a href="https://matrix.to/#/#BlackArch:matrix.org">#BlackArch:matrix.org</a>.` },
    ],
  },
  {
    id: "get-help",
    cat: "Community",
    q: "Where can I get help for a problem that I'm facing?",
    a: [
      { p: "Depending on the problem you're facing, you can visit our Github and submit an issue on our Issue page, such as:" },
      {
        ul: [
          "<strong>BlackArch Site repository:</strong> related to our website. For example: If a link is broken or an image isn't loading.",
          "<strong>BlackArch repository:</strong> related to our packages. For example: a package hasn't been updated for a while or failed to run.",
          "<strong>BlackArch Installer repository:</strong> related to our installer. For example: the installation failed or you can not boot after a successful installation.",
        ],
      },
      { p: `You can also take some time to browse our other repositories. If you still cannot find a solution to your problem, visit our ${matrix} and ask for help. But please be advised, BlackArch users are in different parts of the globe (different time zones). Therefore, be patient. Ask your question and wait for a reply.` },
    ],
  },
  {
    id: "contribute",
    cat: "Community",
    q: "I would like to help. What can I do?",
    a: [
      { p: `BlackArch Linux is a huge project, we are adding new applications and features everyday. If you would like to help us with anything, visit our ${matrix}. Just remember to wait for a reply, we are in different time zones.` },
    ],
  },
];

const categories = [...new Set(items.map((i) => i.cat))];
const query = ref("");
const cat = ref("");
const open = ref(new Set());
const copied = ref("");

const text = (i) =>
  [i.q, ...i.a.flatMap((b) => (b.p ? [b.p] : b.ul ? b.ul : [b.code]))]
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase();
const index = items.map((i) => ({ id: i.id, t: text(i) }));

const visible = computed(() => {
  const words = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(
    (i) =>
      (!cat.value || i.cat === cat.value) &&
      words.every((w) => index.find((x) => x.id === i.id).t.includes(w))
  );
});
const countFor = (c) => items.filter((i) => i.cat === c).length;

const html = (s) => s.replace(/href="(\/[^"]*)"/g, (_, p) => `href="${withBase(p)}"`);

function toggle(id, e) {
  const next = new Set(open.value);
  e.target.open ? next.add(id) : next.delete(id);
  open.value = next;
}
function openFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (items.some((i) => i.id === id)) {
    open.value = new Set([...open.value, id]);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
  }
}
onMounted(() => {
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
});

async function copy(code) {
  try {
    await navigator.clipboard.writeText(code);
    copied.value = code;
    setTimeout(() => (copied.value = ""), 1600);
  } catch {}
}
</script>

<template>
  <div class="faq">
    <div class="search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      <input v-model="query" type="search" :placeholder="UI.placeholder" :aria-label="UI.searchLabel" />
    </div>

    <div class="chips" role="group">
      <button type="button" :class="{ on: !cat }" :aria-pressed="!cat" @click="cat = ''">{{ UI.all }} <small>{{ items.length }}</small></button>
      <button v-for="c in categories" :key="c" type="button" dir="ltr" :class="{ on: cat === c }" :aria-pressed="cat === c" @click="cat = cat === c ? '' : c">{{ c }} <small>{{ countFor(c) }}</small></button>
    </div>

    <p class="count" role="status">{{ UI.count(visible.length, items.length) }}</p>

    <div v-if="visible.length" class="list">
      <details v-for="i in visible" :id="i.id" :key="i.id" :open="open.has(i.id)" @toggle="toggle(i.id, $event)">
        <summary>
          <span class="cat" dir="ltr">{{ i.cat }}</span>
          <span class="q" dir="ltr" lang="en">{{ i.q }}</span>
          <a class="perma" :href="'#' + i.id" :aria-label="UI.permalink" @click.stop>#</a>
        </summary>
        <div class="answer" dir="ltr" lang="en">
          <template v-for="(b, n) in i.a" :key="n">
            <p v-if="b.p" v-html="html(b.p)" />
            <ul v-else-if="b.ul"><li v-for="(li, k) in b.ul" :key="k" v-html="html(li)" /></ul>
            <div v-else class="cmd">
              <pre><code>{{ b.code }}</code></pre>
              <button type="button" :aria-label="UI.copyLabel" @click="copy(b.code)">{{ copied === b.code ? UI.copied : UI.copy }}</button>
            </div>
          </template>
        </div>
      </details>
    </div>
    <div v-else class="empty">
      <p>{{ UI.noResults }} “{{ query }}”.</p>
      <button type="button" @click="query = ''; cat = ''">{{ UI.clear }}</button>
    </div>
  </div>
</template>

<style scoped>
.faq { margin-top: 16px; }
.search { position: relative; }
.search svg { position: absolute; left: 12px; top: 50%; width: 16px; height: 16px; transform: translateY(-50%); color: var(--vp-c-text-3); pointer-events: none; }
.search input { width: 100%; box-sizing: border-box; padding: 10px 12px 10px 38px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font: 14px var(--vp-font-family-mono); }
.search input:focus { outline: none; border-color: var(--vp-c-brand-1); }
.chips { display: flex; gap: 8px; margin: 14px 0 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; }
.chips button { flex: none; padding: 5px 12px; border: 1px solid var(--vp-c-divider); border-radius: 99px; background: none; color: var(--vp-c-text-2); font-size: 13px; cursor: pointer; }
.chips button small { margin-left: 4px; font-family: var(--vp-font-family-mono); color: var(--vp-c-text-3); }
.chips button:hover { border-color: var(--vp-c-brand-1); }
.chips button.on { background: var(--ba-red); border-color: var(--ba-red); color: #fff; }
.chips button.on small { color: rgba(255, 255, 255, 0.8); }
.count { margin: 6px 0 14px; font: 12px var(--vp-font-family-mono); color: var(--vp-c-text-3); }
.list { display: flex; flex-direction: column; gap: 10px; }
details { border: 1px solid var(--vp-c-divider); border-radius: var(--ba-radius); background: var(--vp-c-bg-soft); transition: border-color 0.15s; scroll-margin-top: calc(var(--vp-nav-height) + 16px); }
details:hover, details[open] { border-color: var(--vp-c-brand-1); }
details[open] { box-shadow: var(--ba-shadow); }
summary { display: flex; align-items: baseline; gap: 12px; padding: 14px 16px; cursor: pointer; list-style: none; }
summary::-webkit-details-marker { display: none; }
summary::before { content: "+"; flex: none; width: 14px; font: 600 16px var(--vp-font-family-mono); color: var(--vp-c-brand-1); }
details[open] > summary::before { content: "−"; }
.cat { flex: none; font: 11px var(--vp-font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--vp-c-text-3); }
.q { flex: 1; font-weight: 600; line-height: 1.4; }
.perma { flex: none; color: var(--vp-c-text-3); text-decoration: none; font-family: var(--vp-font-family-mono); opacity: 0; transition: opacity 0.15s; }
summary:hover .perma, .perma:focus-visible { opacity: 1; }
.answer { padding: 0 16px 16px 42px; color: var(--vp-c-text-2); line-height: 1.7; font-size: 15px; }
.answer :deep(p), .answer :deep(ul) { margin: 0 0 12px; }
.answer :deep(ul) { padding-left: 20px; }
.answer :deep(li) { margin-bottom: 6px; }
.answer :deep(code) { font-family: var(--vp-font-family-mono); font-size: 0.9em; }
.cmd { position: relative; margin: 0 0 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg); }
.cmd pre { margin: 0; padding: 12px 70px 12px 14px; overflow-x: auto; }
.cmd code { font: 13px/1.6 var(--vp-font-family-mono); color: var(--vp-c-text-1); background: none; padding: 0; white-space: pre; }
.cmd button { position: absolute; top: 8px; right: 8px; padding: 3px 10px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font: 12px var(--vp-font-family-mono); cursor: pointer; }
.cmd button:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.empty { padding: 32px 16px; text-align: center; border: 1px dashed var(--vp-c-divider); border-radius: var(--ba-radius); }
.empty button { padding: 6px 14px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: none; color: var(--vp-c-text-1); cursor: pointer; }
.empty button:hover { border-color: var(--vp-c-brand-1); }
@media (max-width: 640px) {
  summary { flex-wrap: wrap; gap: 4px 10px; }
  .cat { order: 3; flex-basis: 100%; padding-left: 24px; }
  .answer { padding-left: 16px; }
}
@media (prefers-reduced-motion: reduce) { details, .perma { transition: none; } }
</style>
