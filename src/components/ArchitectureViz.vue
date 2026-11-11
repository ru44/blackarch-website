<script setup>
import { useClipboard } from "../composables/useClipboard.js";
import { ref, computed } from "vue";
import { useT } from "../i18n/index.js";

// Visible text lives in the "arch" namespace (translatable); commands and paths
// below stay untranslated. Facts come from the public BlackArch repos
// (blackarch, blackarch-iso) and strap.sh.
const T = useT("arch", {
  aria: "BlackArch architecture explorer",
  stepsAria: "Steps; use arrow keys",
  copy: "copy",
  copied: "copied",
  copyAria: (c) => `Copy ${c}`,
  tabs: [
    { label: "Layers", hint: "How BlackArch sits on Arch" },
    { label: "Build pipeline", hint: "PKGBUILD to your pacman" },
    { label: "Update flow", hint: "How changes get in" },
    { label: "ISO layers", hint: "How images are assembled" },
  ],
  layers: [
    {
      t: "Tools",
      b: "~2800+ packages, each a PKGBUILD under packages/<name> in the BlackArch repo.",
    },
    {
      t: "Category groups",
      b: "Packages are grouped as blackarch-<category>, plus the all-in-one blackarch group.",
    },
    {
      t: "BlackArch repository",
      b: "An unofficial user repository, trusted via the blackarch-keyring package.",
    },
    {
      t: "Arch Linux",
      b: "core, extra and multilib repos, pacman, systemd and the rolling-release base. BlackArch adds to it, it does not fork it.",
    },
  ],
  pipeline: [
    { t: "Upstream source", b: "A tool's release or git repo is the starting point." },
    {
      t: "PKGBUILD",
      b: "A maintainer writes a PKGBUILD in packages/<name> of the blackarch repo, from the blackarch-pkgbuilds templates.",
    },
    {
      t: "Clean chroot build",
      b: "babuild wraps Arch's archbuild / makechrootpkg so build dependencies are checked in isolation.",
    },
    { t: "Sign", b: "Built packages get detached GPG signatures (.sig)." },
    {
      t: "Release & repo-add",
      b: "barelease pushes packages to the build server, takes a lock, and updates the repo database.",
    },
    {
      t: "Mirrors",
      b: "Mirrors poll a lastupdate timestamp over HTTP and only rsync when it changes.",
    },
    {
      t: "Your machine",
      b: "pacman syncs blackarch.db and verifies signatures against the keyring.",
    },
  ],
  updates: [
    {
      t: "Open a PR",
      b: "Contributors fork the blackarch repo and open a PR. Title format: <pkgname>: <change>.",
    },
    {
      t: "Test three ways",
      b: "Build in a clean chroot, run it in a clean chroot, then install on a full BlackArch system to catch file conflicts.",
    },
    { t: "Queue for release", b: "Every modified package name is added to lists/to-release." },
    {
      t: "Developer builds & signs",
      b: "A BlackArch developer with build-server access builds, signs and releases it.",
    },
    {
      t: "Helper scripts",
      b: "The repo ships scripts for finding outdated packages and bumping versions (outdated, pkgver, pkgrel, up-officials).",
    },
    { t: "Users update", b: "Rolling release: the next pacman -Syu pulls the new package." },
  ],
  iso: [
    {
      t: "base",
      b: "Shared by every variant: keyring setup, mirror selection, boot theme, shell config, core packages.",
    },
    {
      t: "graphical",
      b: "Desktop layer used by Full and Slim (Slim defaults to XFCE4 + LightDM).",
    },
    {
      t: "variant",
      b: "full, slim or netinstall adds its own package list. Later layers override files; package lists are concatenated.",
    },
    {
      t: "merge-profile",
      b: "Layers are merged into one archiso profile; .in templates get placeholders filled from variant.conf.",
    },
    {
      t: "mkarchiso",
      b: "archiso builds the final image. Full = base+graphical+full, Slim = base+graphical+slim, NetInstall = base+netinstall.",
    },
  ],
});

const tabIds = ["layers", "pipeline", "updates", "iso"];
const tabs = computed(() => tabIds.map((id, i) => ({ id, ...T.tabs[i] })));
const active = ref("layers");

const commands = {
  layers: [
    "pacman -S nmap",
    "pacman -S blackarch-webapp",
    "blackarch.org/blackarch/blackarch/os/<arch>",
    "pacman -Syu",
  ],
  pipeline: [
    "github.com/<author>/<tool>",
    "packages/<name>/PKGBUILD",
    "scripts/babuild",
    "scripts/basign",
    "scripts/barelease",
    "scripts/syncrepo",
    "pacman -Syu",
  ],
  updates: [
    "pkgname: bump to 1.2.3",
    "HOWTO-DEV.md",
    "lists/to-release",
    "babuild → basign → barelease",
    "scripts/outdated",
    "pacman -Syu",
  ],
  iso: [
    "layers/base",
    "layers/graphical",
    "layers/<variant>",
    "tools/merge-profile.sh",
    "tools/build-iso.sh --class slim",
  ],
};
const data = computed(() =>
  Object.fromEntries(
    tabIds.map((id) => [
      id,
      commands[id].map((c, i) => ({ ...(T[id][i] || { t: "", b: "" }), c })),
    ]),
  ),
);

const steps = computed(() => data.value[active.value]);
const selected = ref(0);
function pick(tab) {
  active.value = tab;
  selected.value = 0;
}
const current = computed(() => steps.value[selected.value]);
const { copy, isCopied } = useClipboard(1400);
function onKey(e) {
  const n = steps.value.length;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") selected.value = (selected.value + 1) % n;
  else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
    selected.value = (selected.value - 1 + n) % n;
  else return;
  e.preventDefault();
}
</script>

<template>
  <section class="arch" :aria-label="T.aria">
    <div class="tabs" role="tablist">
      <button
        v-for="t in tabs"
        :key="t.id"
        role="tab"
        :aria-selected="active === t.id"
        :class="{ on: active === t.id }"
        @click="pick(t.id)"
      >
        <strong>{{ t.label }}</strong>
        <span>{{ t.hint }}</span>
      </button>
    </div>

    <div class="stage">
      <ol
        class="flow"
        :class="{ stack: active === 'layers' }"
        @keydown="onKey"
        role="listbox"
        tabindex="0"
        :aria-label="T.stepsAria"
      >
        <li
          v-for="(s, i) in steps"
          :key="active + i"
          role="option"
          :aria-selected="selected === i"
          :class="{ on: selected === i, done: active !== 'layers' && i < selected }"
          :style="{ '--i': i, '--w': '100%' }"
          @click="selected = i"
          @mouseenter="selected = i"
        >
          <span class="num">{{ active === "layers" ? "L" + (steps.length - i) : i + 1 }}</span>
          <span class="name">{{ s.t }}</span>
        </li>
      </ol>

      <article class="detail" aria-live="polite">
        <h3>{{ current.t }}</h3>
        <p>{{ current.b }}</p>
        <div class="cmd">
          <code>{{ current.c }}</code>
          <button type="button" @click="copy(current.c)" :aria-label="T.copyAria(current.c)">
            {{ isCopied(current.c) ? T.copied : T.copy }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.arch {
  margin: 24px 0;
}
.tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}
.tabs button {
  text-align: left;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--ba-radius-sm);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition:
    border-color 0.15s,
    background 0.15s;
}
.tabs button span {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.tabs button:hover {
  border-color: var(--vp-c-brand-1);
}
.tabs button.on {
  border-color: var(--vp-c-brand-1);
  background: var(--ba-red-soft);
}
.stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 16px;
  align-items: start;
}
.flow {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  outline-offset: 4px;
}
.flow li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--ba-radius-sm);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    transform 0.15s;
  animation: rise 0.35s ease both;
  animation-delay: calc(var(--i) * 45ms);
}
.flow:not(.stack) li + li {
  margin-top: 18px;
}
.flow:not(.stack) li + li::before {
  content: "";
  position: absolute;
  inset-inline-start: 24px;
  top: -19px;
  height: 18px;
  width: 2px;
  background: var(--vp-c-divider);
}
.flow:not(.stack) li.done::before,
.flow:not(.stack) li.on::before {
  background: var(--vp-c-brand-1);
}
.flow.stack li + li {
  margin-top: 6px;
}
.flow.stack li {
  padding: 16px 14px;
}
.flow li.on {
  border-color: var(--vp-c-brand-1);
  background: var(--ba-red-soft);
  transform: translateX(4px);
}
.num {
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font: 600 12px var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}
.flow li.on .num,
.flow li.done .num {
  background: var(--ba-red);
  border-color: var(--ba-red);
  color: #fff;
}
.name {
  font-weight: 600;
}
.detail {
  position: sticky;
  top: calc(var(--vp-nav-height) + 16px);
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--ba-radius);
  background: var(--vp-c-bg-soft);
  box-shadow: var(--ba-shadow);
}
.detail h3 {
  margin: 0 0 8px;
  font-size: 20px;
}
.detail p {
  margin: 0 0 14px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}
.cmd {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 6px 12px;
  border-radius: var(--ba-radius-sm);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  direction: ltr;
  unicode-bidi: isolate;
  text-align: left;
}
.cmd code {
  flex: 1;
  min-width: 0;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  overflow-wrap: anywhere;
  background: none;
  padding: 0;
}
.cmd code::before {
  content: "$ ";
  color: var(--vp-c-text-3);
}
.cmd button {
  flex: none;
  font: 12px var(--vp-font-family-mono);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.cmd button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
/* Layers tab: clean stacked rows, newest layer on top, Arch as the foundation */
.flow.stack {
  gap: 0;
}
.flow.stack li {
  width: 100%;
  padding: 16px 16px 16px 14px;
  border-radius: 0;
  border-bottom-width: 0;
  gap: 14px;
  background: var(--vp-c-bg-soft);
  white-space: nowrap;
}
.flow.stack li:first-child {
  border-radius: var(--ba-radius-sm) var(--ba-radius-sm) 0 0;
}
.flow.stack li:last-child {
  border-radius: 0 0 var(--ba-radius-sm) var(--ba-radius-sm);
  border-bottom-width: 1px;
  background: var(--vp-c-bg-alt);
}
.flow.stack li + li {
  margin-top: 0;
}
.flow.stack li + li::before {
  content: none;
}
.flow.stack li::after {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--ba-red);
  opacity: calc(1 - var(--i) * 0.22);
}
.flow.stack li.on {
  transform: none;
  background: var(--ba-red-soft);
  border-color: var(--vp-c-brand-1);
  border-bottom-width: 1px;
  z-index: 1;
}
.flow.stack li .name {
  flex: 1;
}
.flow.stack li:last-child .name::after {
  content: "foundation";
  margin-inline-start: 10px;
  font: 11px var(--vp-font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (max-width: 720px) {
  .stage {
    grid-template-columns: 1fr;
  }
  .detail {
    position: static;
  }
}
@media (prefers-reduced-motion: reduce) {
  .flow li {
    animation: none;
    transition: none;
  }
}
</style>
