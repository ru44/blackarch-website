<script setup>
import { ref, computed } from "vue";

const tabs = [
  { id: "layers", label: "Layers", hint: "How BlackArch sits on Arch" },
  { id: "pipeline", label: "Build pipeline", hint: "PKGBUILD to your pacman" },
  { id: "updates", label: "Update flow", hint: "How changes get in" },
  { id: "iso", label: "ISO layers", hint: "How images are assembled" },
];
const active = ref("layers");

// Every step: title, short body, optional command/path. Facts come from the
// public BlackArch repos (blackarch, blackarch-iso) and strap.sh.
const data = {
  layers: [
    { t: "Tools", b: "~2800+ packages, each a PKGBUILD under packages/<name> in the BlackArch repo.", c: "pacman -S nmap" },
    { t: "Category groups", b: "Packages are grouped as blackarch-<category>, plus the all-in-one blackarch group.", c: "pacman -S blackarch-webapp" },
    { t: "BlackArch repository", b: "An unofficial user repository, trusted via the blackarch-keyring package.", c: "blackarch.org/blackarch/blackarch/os/<arch>" },
    { t: "Arch Linux", b: "core, extra and multilib repos, pacman, systemd and the rolling-release base. BlackArch adds to it, it does not fork it.", c: "pacman -Syu" },
  ],
  pipeline: [
    { t: "Upstream source", b: "A tool's release or git repo is the starting point.", c: "github.com/<author>/<tool>" },
    { t: "PKGBUILD", b: "A maintainer writes a PKGBUILD in packages/<name> of the blackarch repo, from the blackarch-pkgbuilds templates.", c: "packages/<name>/PKGBUILD" },
    { t: "Clean chroot build", b: "babuild wraps Arch's archbuild / makechrootpkg so build dependencies are checked in isolation.", c: "scripts/babuild" },
    { t: "Sign", b: "Built packages get detached GPG signatures (.sig).", c: "scripts/basign" },
    { t: "Release & repo-add", b: "barelease pushes packages to the build server, takes a lock, and updates the repo database.", c: "scripts/barelease" },
    { t: "Mirrors", b: "Mirrors poll a lastupdate timestamp over HTTP and only rsync when it changes.", c: "scripts/syncrepo" },
    { t: "Your machine", b: "pacman syncs blackarch.db and verifies signatures against the keyring.", c: "pacman -Syu" },
  ],
  updates: [
    { t: "Open a PR", b: "Contributors fork the blackarch repo and open a PR. Title format: <pkgname>: <change>.", c: "pkgname: bump to 1.2.3" },
    { t: "Test three ways", b: "Build in a clean chroot, run it in a clean chroot, then install on a full BlackArch system to catch file conflicts.", c: "HOWTO-DEV.md" },
    { t: "Queue for release", b: "Every modified package name is added to lists/to-release.", c: "lists/to-release" },
    { t: "Developer builds & signs", b: "A BlackArch developer with build-server access builds, signs and releases it.", c: "babuild → basign → barelease" },
    { t: "Helper scripts", b: "The repo ships scripts for finding outdated packages and bumping versions (outdated, pkgver, pkgrel, up-officials).", c: "scripts/outdated" },
    { t: "Users update", b: "Rolling release: the next pacman -Syu pulls the new package.", c: "pacman -Syu" },
  ],
  iso: [
    { t: "base", b: "Shared by every variant: keyring setup, mirror selection, boot theme, shell config, core packages.", c: "layers/base" },
    { t: "graphical", b: "Desktop layer used by Full and Slim (Slim defaults to XFCE4 + LightDM).", c: "layers/graphical" },
    { t: "variant", b: "full, slim or netinstall adds its own package list. Later layers override files; package lists are concatenated.", c: "layers/<variant>" },
    { t: "merge-profile", b: "Layers are merged into one archiso profile; .in templates get placeholders filled from variant.conf.", c: "tools/merge-profile.sh" },
    { t: "mkarchiso", b: "archiso builds the final image. Full = base+graphical+full, Slim = base+graphical+slim, NetInstall = base+netinstall.", c: "tools/build-iso.sh --class slim" },
  ],
};

const steps = computed(() => data[active.value]);
const selected = ref(0);
function pick(tab) {
  active.value = tab;
  selected.value = 0;
}
const current = computed(() => steps.value[selected.value]);
const copied = ref(false);
async function copy() {
  try {
    await navigator.clipboard.writeText(current.value.c);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1400);
  } catch {}
}
function onKey(e) {
  const n = steps.value.length;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") selected.value = (selected.value + 1) % n;
  else if (e.key === "ArrowUp" || e.key === "ArrowLeft") selected.value = (selected.value - 1 + n) % n;
  else return;
  e.preventDefault();
}
</script>

<template>
  <section class="arch" aria-label="BlackArch architecture explorer">
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
      <ol class="flow" :class="{ stack: active === 'layers' }" @keydown="onKey" role="listbox" tabindex="0" aria-label="Steps; use arrow keys">
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
          <button type="button" @click="copy" :aria-label="'Copy ' + current.c">{{ copied ? "copied" : "copy" }}</button>
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
  transition: border-color 0.15s, background 0.15s;
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
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
  animation: rise 0.35s ease both;
  animation-delay: calc(var(--i) * 45ms);
}
.flow:not(.stack) li + li {
  margin-top: 18px;
}
.flow:not(.stack) li + li::before {
  content: "";
  position: absolute;
  left: 24px;
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
.cmd { display: flex; align-items: center; gap: 8px; padding: 6px 6px 6px 12px; border-radius: var(--ba-radius-sm); background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); }
.cmd code { flex: 1; min-width: 0; color: var(--vp-c-brand-1); font-size: 13px; overflow-wrap: anywhere; background: none; padding: 0; }
.cmd code::before { content: "$ "; color: var(--vp-c-text-3); }
.cmd button { flex: none; font: 12px var(--vp-font-family-mono); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); cursor: pointer; }
.cmd button:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-text-1); }
/* Layers tab: clean stacked rows, newest layer on top, Arch as the foundation */
.flow.stack { gap: 0; }
.flow.stack li { width: 100%; padding: 16px 16px 16px 14px; border-radius: 0; border-bottom-width: 0; gap: 14px; background: var(--vp-c-bg-soft); white-space: nowrap; }
.flow.stack li:first-child { border-radius: var(--ba-radius-sm) var(--ba-radius-sm) 0 0; }
.flow.stack li:last-child { border-radius: 0 0 var(--ba-radius-sm) var(--ba-radius-sm); border-bottom-width: 1px; background: var(--vp-c-bg-alt); }
.flow.stack li + li { margin-top: 0; }
.flow.stack li + li::before { content: none; }
.flow.stack li::after { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--ba-red); opacity: calc(1 - var(--i) * 0.22); }
.flow.stack li.on { transform: none; background: var(--ba-red-soft); border-color: var(--vp-c-brand-1); border-bottom-width: 1px; z-index: 1; }
.flow.stack li .name { flex: 1; }
.flow.stack li:last-child .name::after { content: "foundation"; margin-left: 10px; font: 11px var(--vp-font-family-mono); text-transform: uppercase; letter-spacing: .08em; color: var(--vp-c-text-3); }
@keyframes rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
@media (max-width: 720px) {
  .stage { grid-template-columns: 1fr; }
  .detail { position: static; }
}
@media (prefers-reduced-motion: reduce) {
  .flow li { animation: none; transition: none; }
}
</style>
