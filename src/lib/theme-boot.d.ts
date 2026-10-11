/**
 * Devuelve el codigo JS (IIFE) del script de arranque.
 * @param {{ themeKey?: string, fontKey?: string, themes?: string[] }} [opts]
 *   `themes`: valores guardados que se aceptan como data-theme.
 */
export function themeBootScript(opts?: {
    themeKey?: string;
    fontKey?: string;
    themes?: string[];
}): string;
/**
 * Fija el tema en runtime y lo persiste. 'system' borra la eleccion y deja que
 * el CSS siga al sistema.
 * @param {'light'|'dark'|'system'} theme
 */
export function setTheme(theme: "light" | "dark" | "system", opts?: {}): void;
export const THEME_STORAGE_KEY: "swal-theme";
export const FONT_STORAGE_KEY: "swal-font";
export const DEFAULT_THEMES: string[];
/**
 * Script minimo que marca <html class="js"> antes de pintar (lo necesita
 * MobileNav para plegar el menu sin salto de layout). `themeBootScript` ya lo
 * incluye; usalo solo si no usas el de tema.
 */
export const NAV_BOOT_SCRIPT: "(function(){document.documentElement.classList.add(\"js\");})();";
/** Script listo para insertar tal cual (valores por defecto). */
export const THEME_BOOT_SCRIPT: string;
