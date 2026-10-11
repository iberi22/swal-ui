/**
 * @param {{ light?: string, dark?: string, defaultMode?: 'light'|'dark'|'system', storageKey?: string,
 *           themeColor?: { light: string, dark: string } }} [opts]
 * @returns {string} script en linea (JavaScript plano) para el <head>
 */
export function themeModeScript(opts?: {
    light?: string;
    dark?: string;
    defaultMode?: "light" | "dark" | "system";
    storageKey?: string;
    themeColor?: {
        light: string;
        dark: string;
    };
}): string;
/** Modo guardado (en el navegador); 'light' fuera de el o si no hay `window.swalTheme`. */
export function getThemeMode(): any;
/** Cambia el modo (requiere que themeModeScript() haya corrido en la pagina). */
export function setThemeMode(mode: any): void;
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
export const THEME_MODE_KEY: "swal:theme-mode";
export const THEME_MODES: string[];
