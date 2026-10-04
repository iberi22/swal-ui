import type { PanelPrefs, Preferences, PrefsSchema } from './types';
export * from './types';

export function defaultPrefs(schema: PrefsSchema): Preferences;
export function resolvePrefs(schema: PrefsSchema, stored: unknown): Preferences;
export function applyPreset(schema: PrefsSchema, prefs: Preferences, presetId: string): Preferences;
export function isModuleEnabled(prefs: Preferences, id: string): boolean;
export function isPanelEnabled(prefs: Preferences, id: string): boolean;
export function panelOption<T extends boolean | string | number>(prefs: Preferences, panelId: string, optionId: string, fallback: T): T;
export function moduleGroups(schema: PrefsSchema): { group: string; modules: PrefsSchema['modules'] }[];
export function panelScopes(schema: PrefsSchema): { scope: string; panels: PrefsSchema['panels'] }[];

export const PREFS_EVENT: 'swal:prefschange';
export interface PrefsStoreOptions {
  schema: PrefsSchema;
  endpoint: string;
  storageKey?: string;
  fetcher?: typeof fetch;
}
export interface PrefsStore {
  get(): Preferences;
  load(): Promise<Preferences>;
  save(next: Preferences): Promise<{ ok: boolean; prefs: Preferences; error?: string }>;
  subscribe(fn: (p: Preferences) => void): () => void;
}
export function createPrefsStore(opts: PrefsStoreOptions): PrefsStore;

export interface PrefsBootstrapOptions {
  storageKey?: string;
  moduleAttr?: string;
  panelAttr?: string;
}
export function prefsBootstrapScript(opts?: PrefsBootstrapOptions): string;
export type { PanelPrefs };
