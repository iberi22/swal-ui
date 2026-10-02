/**
 * themeMode.js — Modo claro / oscuro / sistema para los temas duales de @swal/ui.
 *
 * Un tema dual son dos valores de `data-theme` en <html> (ej. "taller" / "taller-dark",
 * "antigravity-light" / "antigravity"). La preferencia del usuario se guarda en localStorage
 * (`swal:theme-mode` = 'light' | 'dark' | 'system') y se resuelve al valor de data-theme.
 *
 * Para que no parpadee, el script tiene que correr en el <head> ANTES del primer pintado:
 * `themeModeScript()` devuelve ese script como texto para inyectarlo en linea, por ejemplo en
 * Astro `<script is:inline set:html={themeModeScript()} />` o en SvelteKit `%sveltekit.head%`.
 * Una vez cargado deja `window.swalTheme` ({ get, set, resolved }) y emite el evento
 * `swal:themechange` ({ mode, resolved }) en `document`. Se reaplica en `astro:after-swap`
 * (ClientRouter de Astro reemplaza los atributos de <html> en cada navegacion).
 */

export const THEME_MODE_KEY = 'swal:theme-mode';
export const THEME_MODES = ['light', 'dark', 'system'];

/**
 * @param {{ light?: string, dark?: string, defaultMode?: 'light'|'dark'|'system', storageKey?: string,
 *           themeColor?: { light: string, dark: string } }} [opts]
 * @returns {string} script en linea (JavaScript plano) para el <head>
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
