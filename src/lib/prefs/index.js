/**
 * @swal/ui/prefs — preferencias de interfaz declarativas.
 *
 * La app declara un esquema (modulos del menu, paneles con opciones, presets) y este modulo
 * resuelve lo guardado contra el, lo persiste (localStorage + endpoint GET/PUT { prefs }),
 * oculta antes de pintar lo desactivado ([data-pref-module] / [data-pref-panel]) y genera la
 * interfaz de onboarding y de ajustes (componentes PrefsEditor y OnboardingWizard).
 * Tipos en ./types.d.ts. Primer consumidor: GARA-G (lib/prefs.config.ts).
 */
export * from './resolve.js';
export * from './store.js';
export * from './bootstrap.js';
