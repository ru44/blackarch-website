import { reactive, watchEffect } from "vue";
import { useData } from "vitepress";
import ar from "./locales/ar.js";
import br from "./locales/br.js";
import de from "./locales/de.js";
import el from "./locales/el.js";
import es from "./locales/es.js";
import fr from "./locales/fr.js";
import hy from "./locales/hy.js";
import id from "./locales/id.js";
import it from "./locales/it.js";
import pt from "./locales/pt.js";
import ro from "./locales/ro.js";
import ru from "./locales/ru.js";
import tr from "./locales/tr.js";
import zh from "./locales/zh.js";

// Keyed by the locale's BCP47 `lang`; the base language is tried as a fallback.
const dictionaries = { ar, de, el, es, fr, hy, id, it, pt, ro, ru, tr, zh, "pt-BR": br };

/**
 * Translate a component's UI strings.
 * `en` is the English source object (strings or functions); the active
 * locale's `ns` namespace overrides any keys it defines, the rest fall back
 * to English. Returns a reactive object usable in <script> and <template>.
 */
export function useT(ns, en) {
  const { lang } = useData();
  const ui = reactive({ ...en });
  watchEffect(() => {
    const full = lang.value || "en";
    const dict = dictionaries[full] || dictionaries[full.split("-")[0]];
    Object.assign(ui, en, dict?.[ns] || {});
  });
  return ui;
}
