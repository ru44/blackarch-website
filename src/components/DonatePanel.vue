<script setup>
import { ref, onMounted } from "vue";
import QRCode from "qrcode";
import { useT } from "../i18n/index.js";

const btc = "1KiXHGytUEo4Ug6Pjnmf7bs9ss3Ay1w5Uy";
const paypal = "https://www.paypal.com/us/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UPSCCPXHY8EBQ";
const method = ref("paypal");
const copied = ref(false);
const qr = ref("");

onMounted(async () => {
  try {
    qr.value = await QRCode.toString(`bitcoin:${btc}`, { type: "svg", margin: 1, color: { dark: "#0a0a0b", light: "#ffffff" } });
  } catch {}
});

async function copy() {
  try {
    await navigator.clipboard.writeText(btc);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1800);
  } catch {}
}

const T = useT("donate", {
  title: "Keep BlackArch free",
  intro: "The team works on BlackArch voluntarily, in their free time. Donations only pay for project expenses and fund future development. Every amount helps.",
  method: "Payment method",
  paypalTab: "PayPal", btcTab: "Bitcoin",
  paypalText: "Choose any amount on PayPal's secure page. Card or PayPal balance.",
  paypalCta: "Donate with PayPal",
  wallet: "Open in wallet app",
  copy: "copy", copied: "copied", qrLabel: "Bitcoin address QR code", copyAddr: "Copy Bitcoin address",
  waysTitle: "Other ways to help",
  costs: [
    { t: "Website & domain", d: "Hosting and the blackarch.org domain." },
    { t: "Download mirrors", d: "Bandwidth and storage so ISOs and packages stay fast worldwide." },
    { t: "Build & test hardware", d: "Machines to build, sign and test packages before release." },
    { t: "Future development", d: "Funds new tooling and the next releases." },
  ],
  ways: [
    { t: "Star the repo", d: "A star on GitHub goes a long way.", a: "Open GitHub" },
    { t: "Help users", d: "Answer questions in the Matrix channel.", a: "Join Matrix" },
    { t: "Translate", d: "Translate the guide from the LaTeX source.", a: "Get the source" },
    { t: "Sponsor as a company", d: "Organizations can become official sponsors.", a: "Email the team" },
  ],
});
const wayLinks = [
  "https://github.com/BlackArch/blackarch",
  "https://matrix.to/#/#BlackArch:matrix.org",
  "https://github.com/BlackArch/blackarch-guide/tree/master/latex",
  "mailto:team@blackarch.org",
];
</script>

<template>
  <section class="donate">
    <div class="hero">
      <div class="pitch">
        <h2>{{ T.title }}</h2>
        <p>{{ T.intro }}</p>
        <ul class="costs">
          <li v-for="(c, i) in T.costs" :key="i"><strong>{{ c.t }}</strong><span>{{ c.d }}</span></li>
        </ul>
      </div>

      <div class="box">
        <div class="seg" role="tablist" :aria-label="T.method">
          <button role="tab" :aria-selected="method === 'paypal'" :class="{ on: method === 'paypal' }" @click="method = 'paypal'">{{ T.paypalTab }}</button>
          <button role="tab" :aria-selected="method === 'btc'" :class="{ on: method === 'btc' }" @click="method = 'btc'">{{ T.btcTab }}</button>
        </div>

        <div v-if="method === 'paypal'" class="pane">
          <p>{{ T.paypalText }}</p>
          <a class="cta" :href="paypal" target="_blank" rel="noopener noreferrer">{{ T.paypalCta }}</a>
        </div>

        <div v-else class="pane">
          <div v-if="qr" class="qr" v-html="qr" role="img" :aria-label="T.qrLabel"></div>
          <button type="button" class="addr" @click="copy" :aria-label="`${T.copyAddr} ${btc}`">
            <code>{{ btc }}</code><em>{{ copied ? T.copied : T.copy }}</em>
          </button>
          <a class="cta" :href="`bitcoin:${btc}`">{{ T.wallet }}</a>
        </div>
      </div>
    </div>

    <h2>{{ T.waysTitle }}</h2>
    <div class="ways">
      <a v-for="(w, i) in T.ways" :key="i" :href="wayLinks[i]" target="_blank" rel="noopener noreferrer">
        <h3>{{ w.t }}</h3><p>{{ w.d }}</p><span>{{ w.a }} &rarr;</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.hero { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 24px; align-items: start; margin: 16px 0 40px; }
.pitch h2 { margin-top: 0; }
.pitch p { color: var(--vp-c-text-2); line-height: 1.7; }
.costs { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 8px; }
.costs li { display: flex; flex-direction: column; margin: 0; padding: 10px 14px; border-left: 2px solid var(--ba-red); background: var(--vp-c-bg-soft); border-radius: 0 8px 8px 0; }
.costs span { font-size: 13px; color: var(--vp-c-text-2); }
.box { position: sticky; top: calc(var(--vp-nav-height) + 16px); border: 1px solid var(--vp-c-brand-1); border-radius: 14px; background: linear-gradient(180deg, var(--ba-red-soft), var(--vp-c-bg-soft) 50%); padding: 18px; box-shadow: 0 24px 60px -28px rgba(230, 0, 0, .5); }
.seg { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--vp-c-divider); border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
.seg button { padding: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-2); border: 0; cursor: pointer; font-weight: 600; }
.seg button.on { background: var(--ba-red); color: #fff; }
.pane { display: flex; flex-direction: column; gap: 12px; align-items: stretch; }
.pane p { margin: 0; font-size: 14px; color: var(--vp-c-text-2); }
.cta { display: block; text-align: center; padding: 12px 16px; border-radius: 10px; background: var(--ba-red); color: #fff !important; font-weight: 700; text-decoration: none !important; transition: filter .15s, transform .15s; }
.cta:hover { filter: brightness(1.15); transform: translateY(-1px); }
.qr { align-self: center; width: 176px; padding: 8px; background: #fff; border-radius: 10px; line-height: 0; }
.qr :deep(svg) { width: 100%; height: auto; }
.addr { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer; }
.addr:hover { border-color: var(--vp-c-brand-1); }
.addr code { flex: 1; text-align: left; font-size: 12px; background: none; padding: 0; overflow-wrap: anywhere; color: var(--vp-c-text-1); }
.addr em { font-style: normal; font-size: 12px; color: var(--vp-c-brand-1); }
.ways { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin: 16px 0 40px; }
.ways a { display: flex; flex-direction: column; gap: 6px; padding: 18px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); text-decoration: none; color: inherit; transition: border-color .2s, transform .2s; }
.ways a:hover { border-color: var(--vp-c-brand-1); transform: translateY(-3px); }
.ways h3 { margin: 0; font-size: 16px; }
.ways p { margin: 0; flex: 1; font-size: 13.5px; color: var(--vp-c-text-2); line-height: 1.6; }
.ways span { font-size: 13px; font-weight: 600; color: var(--vp-c-brand-1); }
@media (max-width: 820px) { .hero { grid-template-columns: 1fr; } .box { position: static; } }
@media (prefers-reduced-motion: reduce) { .cta, .ways a { transition: none; } }
</style>
