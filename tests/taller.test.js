import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { THEME_MODE_KEY, themeModeScript } from '../src/lib/themeMode.js';

const css = readFileSync(new URL('../src/tokens/taller.css', import.meta.url), 'utf-8');

function tokensOf(selector) {
  const start = css.indexOf(selector);
  const body = css.slice(start, css.indexOf('}', start));
  return [...body.matchAll(/(--swal-[a-z0-9-]+)\s*:/g)].map((m) => m[1]).sort();
}

describe('tema taller', () => {
  it('las dos variantes definen los mismos tokens', () => {
    const light = tokensOf(':root[data-theme="taller"] {');
    expect(light.length).toBeGreaterThan(50);
    expect(tokensOf(':root[data-theme="taller-dark"] {')).toEqual(light);
  });

  it('solo define tokens --swal-* y clases .swal-*', () => {
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const props = [...rules.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1]);
    expect(props.every((p) => p.startsWith('--swal-'))).toBe(true);
    const classes = [...rules.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]);
    expect(classes.every((c) => c.startsWith('swal-') || c === 'is-active')).toBe(true);
  });

  it('cada token tiene un valor que el navegador acepta', () => {
    for (const [, name, value] of css.matchAll(/(--swal-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      expect(value.trim().length, name).toBeGreaterThan(0);
    }
  });
});

describe('themeModeScript', () => {
  function run(stored, prefersDark = false) {
    const attrs = {};
    const listeners = {};
    const doc = {
      documentElement: { setAttribute: (k, v) => (attrs[k] = v), style: {} },
      querySelector: () => null,
      addEventListener: (ev, fn) => (listeners[ev] = fn),
      dispatchEvent: () => true,
    };
    const store = { [THEME_MODE_KEY]: stored };
    const win = {
      matchMedia: () => ({ matches: prefersDark, addEventListener() {} }),
    };
    const ls = { getItem: (k) => store[k] ?? null, setItem: (k, v) => (store[k] = v) };
    new Function('window', 'document', 'localStorage', 'CustomEvent', themeModeScript())(win, doc, ls, function () {});
    return { attrs, win, store };
  }

  it('sin preferencia aplica el claro', () => {
    expect(run(undefined).attrs['data-theme']).toBe('taller');
  });
  it('respeta oscuro y sistema', () => {
    expect(run('dark').attrs['data-theme']).toBe('taller-dark');
    expect(run('system', true).attrs['data-theme']).toBe('taller-dark');
    expect(run('system', false).attrs['data-theme']).toBe('taller');
  });
  it('set() guarda y aplica', () => {
    const { attrs, win, store } = run('light');
    win.swalTheme.set('dark');
    expect(store[THEME_MODE_KEY]).toBe('dark');
    expect(attrs['data-theme']).toBe('taller-dark');
  });
  it('acepta otro tema dual', () => {
    const s = themeModeScript({ light: 'antigravity-light', dark: 'antigravity' });
    expect(s).toContain('antigravity-light');
  });
});
