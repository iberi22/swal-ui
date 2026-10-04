/**
 * tests/prefs.test.js — @swal/ui/prefs: resolver, store y bootstrap.
 * Sin entorno DOM en este paquete: localStorage y document se simulan lo justo.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyPreset, createPrefsStore, defaultPrefs, isModuleEnabled, isPanelEnabled,
  moduleGroups, panelOption, panelScopes, prefsBootstrapScript, PREFS_EVENT, resolvePrefs,
} from '../src/lib/prefs/index.js';

const schema = {
  version: 2,
  modules: [
    { id: 'home', label: 'Inicio', group: 'A', default: true, required: true },
    { id: 'maps', label: 'Mapas', group: 'A', default: true },
    { id: 'beta', label: 'Beta', group: 'B', default: false },
  ],
  panels: [
    {
      id: 'chart', label: 'Grafico', scope: 'Dash', default: true,
      options: [
        { id: 'rows', label: 'Filas', type: 'number', default: 5, min: 1, max: 10 },
        { id: 'kind', label: 'Tipo', type: 'select', default: 'bar', choices: [{ value: 'bar', label: 'B' }, { value: 'line', label: 'L' }] },
        { id: 'legend', label: 'Leyenda', type: 'toggle', default: true },
      ],
    },
    { id: 'core', label: 'Nucleo', scope: 'Dash', default: true, required: true },
  ],
  presets: [{ id: 'lite', label: 'Ligero', modules: { maps: false, ghost: true }, panels: { chart: false } }],
};

// --- DOM minimo ---
class FakeEl { constructor() { this.id = ''; this.textContent = ''; } remove() { fakeDoc.nodes.delete(this.id); } }
const fakeDoc = Object.assign(new EventTarget(), {
  nodes: new Map(),
  head: { appendChild: (el) => fakeDoc.nodes.set(el.id, el) },
  createElement: () => new FakeEl(),
  getElementById: (id) => fakeDoc.nodes.get(id) ?? null,
});
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  clear: () => mem.clear(),
};
globalThis.document = fakeDoc;
globalThis.window = globalThis;
beforeEach(() => { mem.clear(); fakeDoc.nodes.clear(); });

describe('resolvePrefs', () => {
  it('defaults sin onboarding', () => {
    const p = defaultPrefs(schema);
    expect(p).toMatchObject({ version: 2, onboarded: false, modules: { home: true, maps: true, beta: false } });
    expect(p.panels.chart.options).toEqual({ rows: 5, kind: 'bar', legend: true });
  });
  it('descarta claves y tipos invalidos, required siempre activos, numeros acotados', () => {
    const p = resolvePrefs(schema, {
      version: 2, onboarded: true,
      modules: { home: false, maps: 'no', evil: true },
      panels: { chart: { enabled: 0, options: { rows: 99, kind: 'pie', legend: false } }, core: { enabled: false } },
    });
    expect(p.modules).toEqual({ home: true, maps: true, beta: false });
    expect(p.panels.chart).toEqual({ enabled: true, options: { rows: 10, kind: 'bar', legend: false } });
    expect(p.panels.core.enabled).toBe(true);
  });
  it('version vieja vuelve a pedir onboarding; basura no rompe', () => {
    expect(resolvePrefs(schema, { version: 1, onboarded: true }).onboarded).toBe(false);
    for (const junk of [null, 1, 'x', [], { modules: [1] }]) expect(resolvePrefs(schema, junk).modules.home).toBe(true);
  });
  it('presets y consultas', () => {
    const p = applyPreset(schema, defaultPrefs(schema), 'lite');
    expect(p.preset).toBe('lite');
    expect(isModuleEnabled(p, 'maps')).toBe(false);
    expect(isPanelEnabled(p, 'chart')).toBe(false);
    expect(panelOption(p, 'chart', 'rows', 0)).toBe(5);
    expect(moduleGroups(schema).map((g) => g.group)).toEqual(['A', 'B']);
    expect(panelScopes(schema)[0].panels).toHaveLength(2);
  });
});

describe('createPrefsStore', () => {
  const ok = (body) => new Response(JSON.stringify(body), { status: 200 });
  it('cache local, load del servidor y evento', async () => {
    localStorage.setItem('k', JSON.stringify({ version: 2, modules: { maps: false } }));
    const store = createPrefsStore({ schema, endpoint: '/p', storageKey: 'k', fetcher: vi.fn(async () => ok({ prefs: { version: 2, onboarded: true } })) });
    expect(store.get().modules.maps).toBe(false);
    const seen = [];
    document.addEventListener(PREFS_EVENT, (e) => seen.push(e.detail.onboarded), { once: true });
    await store.load();
    expect(seen).toEqual([true]);
    expect(store.get().modules.maps).toBe(true);
  });
  it('save hace PUT y sin red guarda solo local', async () => {
    const fetcher = vi.fn(async (_u, init) => ok({ prefs: JSON.parse(init.body).prefs }));
    const store = createPrefsStore({ schema, endpoint: '/p', storageKey: 'k', fetcher });
    expect((await store.save({ ...store.get(), modules: { maps: false } })).ok).toBe(true);
    expect(fetcher.mock.calls[0][1].method).toBe('PUT');
    const off = createPrefsStore({ schema, endpoint: '/p', storageKey: 'k', fetcher: vi.fn(async () => { throw new TypeError('x'); }) });
    const r = await off.save({ ...off.get(), modules: { beta: true } });
    expect(r.ok).toBe(false);
    expect(JSON.parse(localStorage.getItem('k')).modules.beta).toBe(true);
  });
});

describe('prefsBootstrapScript', () => {
  const css = () => document.getElementById('swal-prefs-style')?.textContent ?? '';
  it('oculta lo apagado y se re-aplica con el evento', () => {
    localStorage.setItem('k', JSON.stringify({ modules: { fuel: false }, panels: { shop: { enabled: false } } }));
    new Function(prefsBootstrapScript({ storageKey: 'k' }))();
    expect(css()).toBe('[data-pref-module="fuel"],[data-pref-panel="shop"]{display:none!important}');
    document.dispatchEvent(new CustomEvent(PREFS_EVENT, { detail: { modules: {} } }));
    expect(css()).toBe('');
  });
  it('JSON roto no rompe', () => {
    localStorage.setItem('k', '{x');
    expect(() => new Function(prefsBootstrapScript({ storageKey: 'k' }))()).not.toThrow();
  });
});
