import { onBeforeUnmount, ref } from "vue";

/**
 * Copy-to-clipboard with a short "copied" state.
 *
 *   const { copy, isCopied } = useClipboard();
 *   <button @click="copy(text)">{{ isCopied(text) ? "copied" : "copy" }}</button>
 *
 * `key` identifies which button was pressed when one component has several;
 * it defaults to the copied text itself.
 */
export function useClipboard(resetAfterMs = 1600) {
  const copiedKey = ref("");
  let timer;

  async function writeText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    // Insecure contexts (plain http) have no Clipboard API.
    const field = document.createElement("textarea");
    field.value = text;
    field.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }

  async function copy(text, key = text) {
    try {
      await writeText(text);
    } catch {
      return false;
    }
    copiedKey.value = key;
    clearTimeout(timer);
    timer = setTimeout(() => (copiedKey.value = ""), resetAfterMs);
    return true;
  }

  onBeforeUnmount(() => clearTimeout(timer));

  return { copy, isCopied: (key) => copiedKey.value === key };
}
