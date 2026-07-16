<script setup>
import { ref } from "vue";
const showWallet = ref(false);
const bitcoinWallet = "1KiXHGytUEo4Ug6Pjnmf7bs9ss3Ay1w5Uy";

const copied = ref(false);
const copyFailed = ref(false);

const copyWallet = async () => {
  copyFailed.value = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(bitcoinWallet);
    } else {
      // Fallback for non-secure contexts where the Clipboard API is unavailable
      const textarea = document.createElement("textarea");
      textarea.value = bitcoinWallet;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (err) {
    copyFailed.value = true;
    console.error("Failed to copy wallet address", err);
  }
};
</script>
<template>
  <div>
    <h2>Support BlackArch Linux</h2>

    <a
      href="https://www.paypal.com/us/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UPSCCPXHY8EBQ"
      target="_blank"
      rel="noopener noreferrer"
      class="paypal-button"
    >
      <svg
        class="paypal-icon"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="paypal"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
      >
        <path
          fill="currentColor"
          d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"
        ></path>
      </svg>
      Donate via PayPal
    </a>

    <button type="button" class="bitcoin-button" @click="showWallet = true">
      <svg
        class="bitcoin-icon"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="bitcoin"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M504 256c0 136.1-111 248-248 248S8 392.1 8 256 119 8 256 8s248 111 248 248zm-141.7-35.33c4.937-32.1-20.19-50.74-54.55-62.57l11.15-44.7-27.21-6.781-10.85 43.52c-7.154-1.783-14.5-3.464-21.8-5.13l10.93-43.81-27.2-6.781-11.15 44.69c-5.922-1.349-11.73-2.682-17.38-4.084l.031-.14-37.53-9.37-7.239 29.06s20.19 4.627 19.76 4.913c11.02 2.751 13.01 10.04 12.68 15.82l-12.7 50.92c.76 .194 1.744 .473 2.829 .907-.907-.225-1.876-.473-2.876-.713l-17.8 71.34c-1.349 3.348-4.767 8.37-12.47 6.464 .271 .395-19.78-4.937-19.78-4.937l-13.51 31.15 35.41 8.827c6.588 1.651 13.05 3.379 19.4 5.006l-11.26 45.21 27.18 6.781 11.15-44.73a1038 1038 0 0 0 21.69 5.627l-11.11 44.52 27.21 6.781 11.26-45.13c46.4 8.781 81.3 5.239 95.99-36.73 11.84-33.79-.589-53.28-25-65.99 17.78-4.098 31.17-15.79 34.75-39.95zm-62.18 87.18c-8.41 33.79-65.31 15.52-83.75 10.94l14.94-59.9c18.45 4.603 77.6 13.72 68.81 48.96zm8.417-87.67c-7.673 30.74-55.03 15.12-70.39 11.29l13.55-54.33c15.36 3.828 64.84 10.97 56.85 43.03z"
        ></path>
      </svg>
      Donate via Bitcoin
    </button>

    <div v-if="showWallet" class="wallet-panel">
      <p class="wallet-label">Bitcoin wallet address</p>
      <code class="wallet-address">{{ bitcoinWallet }}</code>
      <div class="wallet-actions">
        <button class="copy-button" type="button" @click="copyWallet">
          {{ copied ? "Copied!" : "Copy address" }}
        </button>
        <button class="close-button" type="button" @click="showWallet = false">
          Close
        </button>
        <span v-if="copyFailed" class="copy-failed" role="alert">
          Copy failed — select the address and copy it manually.
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bitcoin-button {
  color: white;
  background-color: #f7931a; /* Bitcoin orange */
  font-weight: 500;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 0.625rem 1.25rem;
  text-align: center;
  display: inline-flex;
  align-items: center;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;
}

.bitcoin-button:hover {
  background-color: #e27f00;
}

.bitcoin-icon {
  width: 1rem;
  height: 1rem;
  margin-inline-end: 0.5rem;
}

.wallet-panel {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  max-width: 100%;
  word-break: break-word;
}

.wallet-label {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}

.wallet-address {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-mono);
  user-select: all;
}

.wallet-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.close-button {
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.4rem;
  background-color: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.close-button:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}

.copy-button {
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  background-color: #f7931a;
  color: white;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
}

.copy-button:hover {
  background-color: #e27f00;
}

.copy-button:focus-visible,
.close-button:focus-visible,
.bitcoin-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.copy-failed {
  color: var(--vp-c-danger-1);
  font-size: 0.75rem;
}

.paypal-button {
  text-decoration: none;
  color: white;
  background-color: #003087; /* PayPal Blue */
  font-weight: 500;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 0.625rem 1.25rem;
  text-align: center;
  display: inline-flex;
  align-items: center;
  margin-inline-end: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.paypal-button:hover {
  text-decoration: none;
  color: white;
  cursor: pointer;
  background-color: rgba(0, 48, 135, 0.9);
}

.paypal-button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 48, 135, 0.5);
}

.dark .paypal-button:focus {
  box-shadow: 0 0 0 4px rgba(0, 48, 135, 0.55);
}

.paypal-icon {
  width: 1rem;
  height: 1rem;
  margin-inline-end: 0.5rem;
}
</style>
