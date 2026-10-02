/*
 * Arranque de tema sin destello (no-FOUC). El script se inyecta INLINE en el
 * <head>, antes de pintar. No fija un tema: sin eleccion guardada el CSS sigue
 * a `prefers-color-scheme`; solo aplica una ELECCION explicita del usuario
 * (localStorage) como data-theme, y el preset de fuente guardado como data-font.
 *
 * Astro:   <script is:inline set:html={themeBootScript()}></script>
 * HTML/SSR: `<script>${themeBootScript()}</script>`
 */
export const THEME_STORAGE_KEY = 'swal-theme';
export const FONT_STORAGE_KEY = 'swal-font';
export const DEFAULT_THEMES = ['light', 'dark'];

/**
 * Script minimo que marca <html class="js"> antes de pintar (lo necesita
 * MobileNav para plegar el menu sin salto de layout). `themeBootScript` ya lo
 * incluye; usalo solo si no usas el de tema.
 */
export const NAV_BOOT_SCRIPT = '(function(){document.documentElement.classList.add("js");})();';

/**
 * Devuelve el codigo JS (IIFE) del script de arranque.
 * @param {{ themeKey?: string, fontKey?: string, themes?: string[] }} [opts]
 *   `themes`: valores guardados que se aceptan como data-theme.
 */
export function themeBootScript(opts = {}) {
  const themeKey = opts.themeKey ?? THEME_STORAGE_KEY;
  const fontKey = opts.fontKey ?? FONT_STORAGE_KEY;
  const themes = opts.themes ?? DEFAULT_THEMES;
  return (
    '(function(){try{' +
    'var d=document.documentElement;d.classList.add("js");' +
    `var t=localStorage.getItem(${JSON.stringify(themeKey)});` +
    `if(${JSON.stringify(themes)}.indexOf(t)>-1)d.setAttribute("data-theme",t);` +
    `var f=localStorage.getItem(${JSON.stringify(fontKey)});` +
    'if(f&&/^[a-z0-9-]+$/i.test(f))d.setAttribute("data-font",f);' +
    '}catch(e){/* localStorage bloqueado: se sigue al sistema */}})();'
  );
}

/** Script listo para insertar tal cual (valores por defecto). */
export const THEME_BOOT_SCRIPT = themeBootScript();

/**
 * Fija el tema en runtime y lo persiste. 'system' borra la eleccion y deja que
 * el CSS siga al sistema.
 * @param {'light'|'dark'|'system'} theme
 */
export function setTheme(theme, opts = {}) {
  const key = opts.themeKey ?? THEME_STORAGE_KEY;
  const root = document.documentElement;
  try {
    if (theme === 'system') {
      root.removeAttribute('data-theme');
      localStorage.removeItem(key);
    } else {
      root.setAttribute('data-theme', theme);
      localStorage.setItem(key, theme);
    }
  } catch {
    /* localStorage bloqueado: el cambio vale solo para esta pagina */
  }
}
