/**
 * tests/prefs-components.test.js — PrefsEditor, OnboardingWizard y ThemeModeSwitch.
 * Sin entorno DOM en este paquete (no hay jsdom/happy-dom): se renderiza en servidor
 * (svelte/server) y se comprueba el HTML. Las pruebas de interaccion (click, emision de
 * onchange/onfinish/onskip) corren en la app consumidora (GARA-G, jsdom).
 */
import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import PrefsEditor from '../src/components/PrefsEditor.svelte';
import OnboardingWizard from '../src/components/OnboardingWizard.svelte';
import ThemeModeSwitch from '../src/components/ThemeModeSwitch.svelte';
import { defaultPrefs } from '../src/lib/prefs/index.js';

const schema = {
  version: 1,
  modules: [
    { id: 'home', label: 'Inicio', group: 'General', default: true, required: true },
    { id: 'maps', label: 'Mapas', group: 'General', default: true, help: 'Ver mapas' },
    { id: 'beta', label: 'Beta', group: 'Extra', default: false },
  ],
  panels: [
    {
      id: 'chart', label: 'Grafico', scope: 'Panel', default: true,
      options: [
        { id: 'rows', label: 'Filas', type: 'number', default: 5, min: 1, max: 10 },
        { id: 'kind', label: 'Tipo', type: 'select', default: 'bar', choices: [{ value: 'bar', label: 'Barras' }, { value: 'line', label: 'Linea' }] },
        { id: 'legend', label: 'Leyenda', type: 'toggle', default: true },
      ],
    },
  ],
  presets: [{ id: 'lite', label: 'Ligero', description: 'Solo lo basico', modules: { maps: false } }],
};
const html = (C, props) => render(C, { props }).body;

describe('PrefsEditor (SSR)', () => {
  const body = html(PrefsEditor, { schema, value: defaultPrefs(schema), onchange() {} });
  it('muestra grupos, etiquetas y interruptores accesibles', () => {
    expect(body).toContain('data-testid="prefs-editor"');
    expect(body).toContain('Inicio');
    expect(body).toContain('Ver mapas');
    expect(body).toContain('General');
    expect((body.match(/role="switch"/g) ?? []).length).toBeGreaterThanOrEqual(5);
  });
  it('required queda bloqueado y marcado', () => {
    expect(body).toContain('Siempre visible');
    expect(body).toMatch(/<input[^>]*disabled[^>]*>/);
  });
  it('opciones select (aria-pressed) y number (min/max)', () => {
    expect(body).toMatch(/aria-pressed="true"[^>]*>Barras|Barras/);
    expect(body).toContain('Linea');
    expect(body).toContain('type="number"');
    expect(body).toMatch(/max="10"/);
  });
  it('sections limita lo que se pinta', () => {
    const only = html(PrefsEditor, { schema, value: defaultPrefs(schema), onchange() {}, sections: ['modules'] });
    expect(only).toContain('aria-label="Menú"');
    expect(only).not.toContain('aria-label="Paneles"');
  });
});

describe('OnboardingWizard (SSR)', () => {
  const body = html(OnboardingWizard, { schema, value: defaultPrefs(schema), onfinish() {}, onskip() {} });
  it('arranca en el paso 1 con presets y opcion desde cero', () => {
    expect(body).toContain('data-testid="onboarding-wizard"');
    expect(body).toContain('Paso 1 / 4');
    expect(body).toContain('Bienvenido');
    expect(body).toContain('Ligero');
    expect(body).toContain('Solo lo basico');
    expect(body).toContain('Empezar desde cero');
  });
  it('muestra Omitir solo si hay onskip y Atras deshabilitado', () => {
    expect(body).toContain('Omitir');
    expect(html(OnboardingWizard, { schema, value: defaultPrefs(schema), onfinish() {} })).not.toContain('Omitir');
    expect(body).toMatch(/<button[^>]*disabled[^>]*>Atrás/);
  });
  it('acepta title', () => {
    expect(html(OnboardingWizard, { schema, value: defaultPrefs(schema), onfinish() {}, title: 'Hola taller' })).toContain('Hola taller');
  });
});

describe('ThemeModeSwitch (SSR)', () => {
  const body = html(ThemeModeSwitch, {});
  it('renderiza tres botones con aria-pressed', () => {
    for (const l of ['Claro', 'Oscuro', 'Sistema']) expect(body).toContain(l);
    expect(body).toContain('role="group"');
    expect((body.match(/aria-pressed/g) ?? []).length).toBe(3);
  });
  it('sin window.swalTheme el modo es light', () => {
    expect(body).toMatch(/data-mode="light"[^>]*aria-pressed="true"|aria-pressed="true"[^>]*data-mode="light"/);
  });
});
