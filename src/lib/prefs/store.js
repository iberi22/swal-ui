/**
 * @swal/ui/prefs — store — Preferencias en el navegador: cache local + servidor.
 *
 * Arranca con lo que haya en localStorage (pinta al instante), pide al servidor la version
 * del usuario y guarda los cambios en los dos lados. Emite `swal:prefschange` en `document`
 * con las preferencias resueltas, para que cualquier isla (menu, garage) reaccione.
 * El servidor es la fuente de verdad: las preferencias siguen al usuario entre equipos.
 */
import { resolvePrefs } from './resolve.js';
const PREFS_EVENT = "swal:prefschange";
function createPrefsStore(opts) {
  const key = opts.storageKey ?? "swal:prefs";
  const doFetch = opts.fetcher ?? ((...a) => fetch(...a));
  const subs = /* @__PURE__ */ new Set();
  const readLocal = () => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : void 0;
    } catch {
      return void 0;
    }
  };
  const writeLocal = (p) => {
    try {
      localStorage.setItem(key, JSON.stringify(p));
    } catch {
    }
  };
  let current = resolvePrefs(opts.schema, readLocal());
  const emit = () => {
    for (const fn of subs) fn(current);
    if (typeof document !== "undefined") document.dispatchEvent(new CustomEvent(PREFS_EVENT, { detail: current }));
  };
  return {
    get: () => current,
    async load() {
      try {
        const res = await doFetch(opts.endpoint, { credentials: "same-origin" });
        if (res.ok) {
          const data = await res.json();
          current = resolvePrefs(opts.schema, data.prefs);
          writeLocal(current);
          emit();
        }
      } catch {
      }
      return current;
    },
    async save(next) {
      const resolved = resolvePrefs(opts.schema, { ...next, version: opts.schema.version });
      current = resolved;
      writeLocal(current);
      emit();
      try {
        const res = await doFetch(opts.endpoint, {
          method: "PUT",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prefs: resolved })
        });
        if (!res.ok) {
          const data2 = await res.json().catch(() => ({}));
          return { ok: false, prefs: current, error: data2.error ?? `HTTP ${res.status}` };
        }
        const data = await res.json();
        current = resolvePrefs(opts.schema, data.prefs ?? resolved);
        writeLocal(current);
        return { ok: true, prefs: current };
      } catch {
        return { ok: false, prefs: current, error: "Sin conexion: se guardo solo en este equipo" };
      }
    },
    subscribe(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    }
  };
}
export {
  PREFS_EVENT,
  createPrefsStore
};
