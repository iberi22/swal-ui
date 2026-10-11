/**
 * themeMode.js — light / dark / system mode for the dual themes of @swal/ui.
 *
 * A dual theme is two `data-theme` values on <html> (e.g. "taller" / "taller-dark",
 * "antigravity-light" / "antigravity"). The user preference is stored in localStorage
 * (`swal:theme-mode` = 'light' | 'dark' | 'system') and resolved to the data-theme value.
 *
 * To avoid flashing, the script must run in the <head> BEFORE first paint:
 * `themeModeScript()` returns that script as text for inline injection, e.g. in
 * Astro `<script is:inline set:html={themeModeScript()} />` or SvelteKit `%sveltekit.head%`.
 * Once loaded it leaves `window.swalTheme` ({ get, set, resolved }) and emits the
 * `swal:themechange` ({ mode, resolved }) event on `document`. It re-applies on `astro:after-swap`
 * (Astro ClientRouter replaces the <html> attributes on each navigation).
 */

export const THEME_MODE_KEY = 'swal:theme-mode';
export const THEME_MODES = ['light', 'dark', 'system'];

/**
 * @param {{ light?: string, dark?: string, defaultMode?: 'light'|'dark'|'system', storageKey?: string,
 *           themeColor?: { light: string, dark: string } }} [opts]
 * @returns {string} inline script (plain JavaScript) for the <head>
 */
export function themeModeScript(opts = {}) {
  const cfg = {
    light: opts.light ?? 'taller',
    dark: opts.dark ?? 'taller-dark',
    def: opts.defaultMode ?? 'light',
    key: opts.storageKey ?? THEME_MODE_KEY,
    color: opts.themeColor ?? { light: '#E9ECEF', dark: '#0E1116' },
  };
  return `(function(){var C=${JSON.stringify(cfg)};var m=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
function read(){try{var v=localStorage.getItem(C.key);if(v==='light'||v==='dark'||v==='system')return v}catch(e){}return C.def}
function resolve(x){return x==='system'?(m&&m.matches?'dark':'light'):x}
function apply(x){var r=resolve(x),h=document.documentElement;h.setAttribute('data-theme',C[r]);h.setAttribute('data-theme-mode',x);h.style.colorScheme=r;
var t=document.querySelector('meta[name="theme-color"]');if(t)t.setAttribute('content',C.color[r]);return r}
function emit(x,r){document.dispatchEvent(new CustomEvent('swal:themechange',{detail:{mode:x,resolved:r}}))}
apply(read());
if(!window.swalTheme){window.swalTheme={get:read,resolved:function(){return resolve(read())},set:function(x){if(x!=='light'&&x!=='dark'&&x!=='system')return;try{localStorage.setItem(C.key,x)}catch(e){}emit(x,apply(x))}};
document.addEventListener('astro:after-swap',function(){apply(read())});
if(m&&m.addEventListener)m.addEventListener('change',function(){if(read()==='system')emit('system',apply('system'))})}})();`;
}

/** Modo guardado (en el navegador); 'light' fuera de el o si no hay `window.swalTheme`. */
export function getThemeMode() {
  if (typeof window === 'undefined' || !window.swalTheme) return 'light';
  return window.swalTheme.get();
}

/** Cambia el modo (requiere que themeModeScript() haya corrido en la pagina). */
export function setThemeMode(mode) {
  if (typeof window !== 'undefined' && window.swalTheme) window.swalTheme.set(mode);
}
