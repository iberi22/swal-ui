import { describe, it, expect, afterEach } from 'vitest';
import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import Icon from '../src/components/Icon.svelte';
import MobileNav from '../src/components/MobileNav.svelte';
import AppShell from '../src/components/AppShell.svelte';
import { ICONS, registerIcons, getIcon } from '../src/lib/icons.js';
import { isNavActive, findCurrentNav } from '../src/lib/nav.js';
import { themeBootScript, THEME_BOOT_SCRIPT } from '../src/lib/theme-boot.js';
import * as barrel from '../src/components/index.js';

const items = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/app/sessions', label: 'Sesiones', icon: 'calendar' },
  { href: '/app', label: 'Panel', icon: 'activity' },
];
const html = (c, props) => render(c, { props }).body;
const snip = (text) => createRawSnippet(() => ({ render: () => `<span>${text}</span>` }));

describe('Icon + registro', () => {
  it('pinta un <path> por cada trazo y es decorativo por defecto', () => {
    const out = html(Icon, { name: 'close' });
    expect(out.match(/<path/g)).toHaveLength(ICONS.close.length);
    expect(out).toContain('aria-hidden="true"');
    expect(out).toContain('stroke="currentColor"');
  });

  it('con label se expone como imagen', () => {
    const out = html(Icon, { name: 'heart', label: 'Salud' });
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Salud"');
    expect(out).not.toContain('aria-hidden');
  });

  it('un nombre desconocido no rompe: svg vacio', () => {
    const out = html(Icon, { name: 'no-existe' });
    expect(out).toContain('<svg');
    expect(out).not.toContain('<path');
  });

  it('registerIcons extiende el registro y valida el formato', () => {
    registerIcons({ 'x-test': ['M0 0h1'] });
    expect(getIcon('x-test')).toEqual(['M0 0h1']);
    expect(html(Icon, { name: 'x-test' })).toContain('d="M0 0h1"');
    expect(() => registerIcons({ mal: 'M0 0' })).toThrow(TypeError);
    delete ICONS['x-test'];
  });

  it('paths propios tienen prioridad sobre name', () => {
    expect(html(Icon, { name: 'home', paths: ['M1 1h2'] })).toContain('d="M1 1h2"');
  });
});

describe('navegacion activa', () => {
  it('"/" solo coincide exacto y los ancestros respetan el segmento', () => {
    expect(isNavActive({ href: '/' }, '/app')).toBe(false);
    expect(isNavActive({ href: '/' }, '/')).toBe(true);
    expect(isNavActive({ href: '/app' }, '/app/sessions')).toBe(true);
    expect(isNavActive({ href: '/app' }, '/app2')).toBe(false);
    expect(isNavActive({ href: '/app', exact: true }, '/app/sessions')).toBe(false);
  });

  it('gana el item mas especifico', () => {
    expect(findCurrentNav(items, '/app/sessions/3').label).toBe('Sesiones');
    expect(findCurrentNav(items, '/otra')).toBeUndefined();
  });
});

describe('MobileNav', () => {
  it('renderiza un enlace por item, marca el activo con aria-current', () => {
    const out = html(MobileNav, { items, currentPath: '/app/sessions' });
    expect(out.match(/class="nav-item/g)).toHaveLength(3);
    expect(out.match(/aria-current="page"/g)).toHaveLength(2); // Sesiones y Panel (ancestro)
    expect(out).toContain('aria-label="Principal"');
  });

  it('SSR sin JS: sin data-nav (menu visible), boton cerrado y enlazado al menu', () => {
    const out = html(MobileNav, { items, currentPath: '/', id: 'm1', menuLabel: 'Menu' });
    expect(out).not.toContain('data-nav');
    expect(out).toContain('aria-controls="m1"');
    expect(out).toContain('aria-expanded="false"');
  });

  it('la barra movil muestra la seccion actual, o la marca (lead) si se da', () => {
    expect(html(MobileNav, { items, currentPath: '/app/sessions' })).toContain('Sesiones');
    const out = html(MobileNav, { items, currentPath: '/', lead: snip('MARCA') });
    expect(out).toContain('MARCA');
    expect(out).not.toContain('nav-current');
  });
});

describe('AppShell', () => {
  it('compone marca, nav, pie, topbar y contenido por snippets', () => {
    const out = html(AppShell, {
      items,
      currentPath: '/',
      brand: snip('BRAND'),
      navFooter: snip('FOOT'),
      topbar: snip('TOP'),
      children: snip('CONTENIDO'),
    });
    for (const t of ['BRAND', 'FOOT', 'TOP', 'CONTENIDO', 'Sesiones']) expect(out).toContain(t);
    expect(out).toContain('<main');
  });

  it('showNav=false omite la barra lateral', () => {
    const out = html(AppShell, { items, showNav: false, children: snip('SOLO') });
    expect(out).not.toContain('<aside');
    expect(out).toContain('SOLO');
  });
});

describe('theme-boot', () => {
  it('es JS valido y solo aplica temas de la lista blanca', () => {
    expect(() => new Function(THEME_BOOT_SCRIPT)).not.toThrow();
    expect(THEME_BOOT_SCRIPT).toContain('"swal-theme"');
    expect(THEME_BOOT_SCRIPT).toContain('["light","dark"]');
    expect(THEME_BOOT_SCRIPT).toContain('data-font');
  });

  it('se ejecuta sin DOM real: aplica eleccion guardada y tolera localStorage bloqueado', () => {
    const attrs = {};
    const doc = { documentElement: { setAttribute: (k, v) => (attrs[k] = v) } };
    const store = { 'swal-theme': 'light', 'swal-font': 'jetbrains' };
    new Function('document', 'localStorage', themeBootScript())(doc, { getItem: (k) => store[k] ?? null });
    expect(attrs).toEqual({ 'data-theme': 'light', 'data-font': 'jetbrains' });

    const attrs2 = {};
    new Function('document', 'localStorage', themeBootScript())(
      { documentElement: { setAttribute: (k, v) => (attrs2[k] = v) } },
      { getItem: () => 'evil"><script>' },
    );
    expect(attrs2).toEqual({});
    expect(() =>
      new Function('document', 'localStorage', THEME_BOOT_SCRIPT)(doc, {
        getItem: () => { throw new Error('blocked'); },
      }),
    ).not.toThrow();
  });

  it('opciones: clave y temas propios', () => {
    const s = themeBootScript({ themeKey: 'k', themes: ['antigravity'] });
    expect(s).toContain('"k"');
    expect(s).toContain('["antigravity"]');
  });
});

describe('exports', () => {
  it('el barrel expone el shell, el registro y el helper de tema', () => {
    for (const n of ['Icon', 'MobileNav', 'AppShell', 'ICONS', 'registerIcons', 'isNavActive', 'themeBootScript', 'setTheme']) {
      expect(barrel[n], n).toBeDefined();
    }
  });
});

describe('scripts/check-vendored-drift.mjs', () => {
  const root = resolve(import.meta.dirname ?? '.', '..');
  const script = join(root, 'scripts', 'check-vendored-drift.mjs');
  let tmp;
  afterEach(() => tmp && rmSync(tmp, { recursive: true, force: true }));

  it('exit 0 con copia identica y exit 1 al divergir', () => {
    tmp = mkdtempSync(join(tmpdir(), 'swal-drift-'));
    cpSync(join(root, 'src'), join(tmp, 'src'), { recursive: true });
    expect(spawnSync('node', [script, tmp]).status).toBe(0);
    writeFileSync(join(tmp, 'src', 'components', 'Button.svelte'), 'x');
    const r = spawnSync('node', [script, tmp], { encoding: 'utf8' });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('distinto  components/Button.svelte');
  });

  it('exit 2 sin argumentos o con ruta invalida', () => {
    expect(spawnSync('node', [script]).status).toBe(2);
    expect(spawnSync('node', [script, tmpdir()]).status).toBe(2);
  });
});
