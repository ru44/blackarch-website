<script setup>
import { withBase } from "vitepress";
const arch = withBase("/logo/arch.png");
const sword = withBase("/logo/sword.png");
</script>

<template>
  <div class="logo" role="img" aria-label="BlackArch Linux logo">
    <!-- sword sits behind the neon arch; it slides in, then hovers gently -->
    <div class="layer sword-wrap">
      <img class="sword" :src="sword" alt="" width="480" height="480" decoding="async" />
      <i class="glint" :style="{ '--m': `url(${sword})` }"></i>
    </div>
    <div class="layer arch-wrap">
      <img class="arch" :src="arch" alt="" width="480" height="480" decoding="async" />
      <i class="sweep" :style="{ '--m': `url(${arch})` }"></i>
    </div>
  </div>
</template>

<style scoped>
.logo {
  position: relative;
  width: min(340px, 72vw);
  aspect-ratio: 1;
  animation: float 7s ease-in-out infinite;
}
.layer { position: absolute; inset: 0; }
.layer img { width: 100%; height: 100%; display: block; border: 0; border-radius: 0; user-select: none; -webkit-user-drag: none; }

/* sword: unsheath on load, then hover independently of the arch */
.sword-wrap { animation: unsheath 1.1s cubic-bezier(.2, .8, .2, 1) both, hover 5.5s 1.1s ease-in-out infinite; }

/* arch: neon ignites, breathes, and flickers now and then */
.arch-wrap { animation: ignite 1.2s .35s ease-out both; }
.arch { animation: breathe 3.6s 1.6s ease-in-out infinite, flicker 9s 3s linear infinite; }

/* highlights are masked by the artwork itself so they only light the shapes */
.glint, .sweep {
  position: absolute; inset: 0; pointer-events: none;
  -webkit-mask: var(--m) center / 100% 100% no-repeat;
          mask: var(--m) center / 100% 100% no-repeat;
  background-repeat: no-repeat;
}
.glint {
  background-image: linear-gradient(180deg, transparent 0 40%, rgba(180, 220, 255, .85) 50%, transparent 60% 100%);
  background-size: 100% 300%;
  animation: glint 5.5s 2s ease-in-out infinite;
  mix-blend-mode: screen;
}
.sweep {
  background-image: linear-gradient(105deg, transparent 0 42%, rgba(255, 255, 255, .95) 50%, transparent 58% 100%);
  background-size: 300% 100%;
  animation: sweep 6.5s 2.5s ease-in-out infinite;
  mix-blend-mode: screen;
}

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes unsheath { from { opacity: 0; transform: translateY(-70px); } to { opacity: 1; transform: translateY(0); } }
@keyframes hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
@keyframes ignite {
  0% { opacity: 0; filter: brightness(2.4) blur(6px); }
  35% { opacity: .9; filter: brightness(1.8) blur(1px); }
  50% { opacity: .35; }
  70% { opacity: 1; filter: brightness(1.3); }
  100% { opacity: 1; filter: none; }
}
@keyframes breathe {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(120, 170, 255, .55)) drop-shadow(0 0 12px rgba(230, 0, 0, .25)); }
  50% { filter: drop-shadow(0 0 10px rgba(150, 195, 255, .95)) drop-shadow(0 0 26px rgba(230, 0, 0, .5)); }
}
@keyframes flicker {
  0%, 92%, 100% { opacity: 1; }
  93% { opacity: .55; } 94% { opacity: 1; } 95% { opacity: .7; } 96% { opacity: 1; }
}
@keyframes glint { 0%, 55% { background-position: 0 0%; opacity: 0; } 58% { opacity: 1; } 85% { background-position: 0 100%; opacity: 1; } 100% { background-position: 0 100%; opacity: 0; } }
@keyframes sweep { 0%, 40% { background-position: 120% 0; opacity: 0; } 45% { opacity: 1; } 75% { background-position: -20% 0; opacity: 1; } 80%, 100% { background-position: -20% 0; opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .logo, .sword-wrap, .arch-wrap, .arch, .glint, .sweep { animation: none !important; }
  .glint, .sweep { display: none; }
}
</style>
