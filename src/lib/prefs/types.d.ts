/**
 * swal-prefs/schema.ts — Preferencias de interfaz declarativas (modulos del menu y paneles).
 *
 * Modulo PORTABLE al core @swal/ui: no importa nada de la app. La app declara su esquema
 * (que modulos y paneles existen, sus valores por defecto y opciones) y el core resuelve,
 * valida, persiste y genera la interfaz de onboarding y de ajustes a partir de el.
 *
 *   - Modulo: algo que se muestra u oculta entero (una entrada del menu, una pagina).
 *   - Panel: una pieza de una pantalla (un panel del dock, un elemento del HUD) que se
 *     activa o desactiva y puede tener opciones propias.
 *   - Preset: un punto de partida para el onboarding ("manejo maquinaria") que fija modulos
 *     y paneles de una vez; el usuario lo ajusta despues.
 */

export type PrefOptionType = 'toggle' | 'select' | 'number';

export interface PrefOptionDef {
  id: string;
  label: string;
  type: PrefOptionType;
  default: boolean | string | number;
  /** Solo 'select'. */
  choices?: { value: string; label: string }[];
  /** Solo 'number'. */
  min?: number;
  max?: number;
  step?: number;
  help?: string;
}

export interface PrefModuleDef {
  id: string;
  label: string;
  /** Grupo para ordenar la interfaz: "Operacion", "Garage", "Analisis"... */
  group: string;
  default: boolean;
  /** No se puede desactivar (por ejemplo el inicio). */
  required?: boolean;
  help?: string;
}

export interface PrefPanelDef {
  id: string;
  label: string;
  /** Pantalla a la que pertenece: "garage", "dashboard"... */
  scope: string;
  default: boolean;
  required?: boolean;
  help?: string;
  options?: PrefOptionDef[];
}

export interface PrefPresetDef {
  id: string;
  label: string;
  description?: string;
  modules?: Record<string, boolean>;
  panels?: Record<string, boolean>;
}

export interface PrefsSchema {
  /** Sube cuando cambia el esquema de forma incompatible (las preferencias viejas se re-resuelven). */
  version: number;
  modules: PrefModuleDef[];
  panels: PrefPanelDef[];
  presets?: PrefPresetDef[];
}

export interface PanelPrefs {
  enabled: boolean;
  options: Record<string, boolean | string | number>;
}

export interface Preferences {
  version: number;
  /** El usuario completo (u omitio) el onboarding. */
  onboarded: boolean;
  /** Preset elegido en el onboarding, si eligio uno. */
  preset?: string;
  modules: Record<string, boolean>;
  panels: Record<string, PanelPrefs>;
  updatedAt?: string;
}
