import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Mismo criterio que theme.test.ts: el core esta fuera del cwd de vitest
// (src-astro), asi que se resuelve desde process.cwd().
const CORE = resolve(process.cwd());
const read = (p: string) => readFileSync(resolve(CORE, p), 'utf-8');
const soloCss = (src: string) =>
  (src.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

const button = read('src/components/Button.svelte');
const badge = read('src/components/Badge.svelte');
const ticker = read('src/components/GlobalTicker.svelte');
const theme = read('src/tokens/theme.css');

/** Bloque CSS de un selector exacto (primera aparicion). */
const regla = (css: string, selector: string) => {
  const i = css.indexOf(`${selector} {`);
  return i < 0 ? '' : css.slice(i, css.indexOf('}', i));
};

describe('Button — primer plano sobre relleno solido', () => {
  const css = soloCss(button);

  it('no pinta texto con un literal de color', () => {
    // `color: #fff` sobre --swal-accent era blanco sobre marfil en oscuro
    // (1.09:1): los dos CTA de la landing no se leian.
    expect(css).not.toMatch(/color:\s*#fff\b/i);
    expect(css).not.toMatch(/color:\s*(#[0-9a-f]{3,8}|white|black)\s*;/i);
  });

  it('primary y orange usan --swal-on-accent; danger usa --swal-on-danger', () => {
    expect(css).toMatch(/\.primary,\s*\.orange\s*\{[^}]*color:\s*var\(--swal-on-accent\)/);
    expect(regla(css, '.danger')).toContain('color: var(--swal-on-danger)');
  });

  it('el tema define los dos tokens que el boton consume', () => {
    expect(theme).toContain('--swal-on-accent:');
    expect(theme).toContain('--swal-on-danger:');
  });

  it('hover, foco y pulsado son estados distintos', () => {
    expect(css).toMatch(/\.primary:hover:not\(\.busy\)/);
    expect(css).toMatch(/\.primary:active:not\(\.busy\)/);
    expect(css).toMatch(/\.swal-btn:focus-visible\s*\{[^}]*outline:\s*2px solid/);
  });

  it('md y lg cumplen el objetivo tactil de 44px', () => {
    expect(regla(css, '.md')).toMatch(/min-height:\s*44px/);
    expect(regla(css, '.lg')).toMatch(/min-height:\s*(4[4-9]|[5-9]\d)px/);
  });

  it('con href se pinta como enlace, no como <button> dentro de <a>', () => {
    expect(button).toMatch(/\{#if href[^}]*\}\s*<a/);
  });
});

describe('Badge — color de los tokens semanticos', () => {
  const css = soloCss(badge);

  it('no quedan los literales de Edge-Hive pensados solo para oscuro', () => {
    // #fbbf24 sobre papel claro daba ~1.7:1: la etiqueta ambar no se leia.
    for (const hex of ['#34d399', '#fbbf24', '#f87171', '#22d3ee']) {
      expect(css.toLowerCase()).not.toContain(hex);
    }
    for (const t of ['success', 'warning', 'danger', 'info']) {
      expect(css).toContain(`var(--swal-${t})`);
    }
  });
});

describe('GlobalTicker — cinta de estado', () => {
  const css = soloCss(ticker);

  it('desvanece los extremos en vez de cortar el texto contra el borde', () => {
    expect(css).toMatch(/mask-image:\s*linear-gradient/);
    // Con 48px fijos el desvanecido era el 3.9% de la cinta en escritorio y se
    // leia como un corte. Debe ser proporcional, con suelo de 64px.
    expect(css).toMatch(/--ticker-fade:\s*clamp\(64px,\s*\d+%,\s*\d+px\)/);
    expect(css).not.toMatch(/black 48px/);
  });

  it('se pausa con hover y con foco', () => {
    expect(css).toMatch(/:hover \.ticker-track/);
    expect(css).toMatch(/:focus-within \.ticker-track/);
  });

  it('con reduced-motion se queda quieta y sin la copia del bucle', () => {
    const rm = css.slice(css.indexOf('prefers-reduced-motion: reduce'));
    expect(rm).toMatch(/animation:\s*none/);
    expect(rm).toMatch(/\.ticker-clone\s*\{\s*display:\s*none/);
  });

  it('no fuerza mayusculas: la marca se escribe la app, no FI’ZE', () => {
    expect(css).not.toMatch(/text-transform:\s*uppercase/);
  });
});

/* ─── Contraste MEDIDO de la etiqueta de aviso (la ambar de las tarjetas) ───
   El Badge mezcla en sRGB: tinta = 80% tono + 20% texto; fondo = 10% tono sobre
   la tarjeta. Se recalcula aqui igual que lo hace color-mix(in srgb). */
const srgb = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]: number[]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: number[], b: number[], t: number) => a.map((c, i) => c * t + b[i] * (1 - t));

describe('Badge — contraste medido sobre la tarjeta', () => {
  // Tarjeta = --swal-surface compuesta sobre el canvas de cada tema.
  const casos = [
    { tema: 'claro', tono: '#b45309', texto: '#1c1917', tarjeta: mix([255, 255, 255], hex('#faf9f5'), 0.9) },
    { tema: 'oscuro', tono: '#fbbf24', texto: '#f5f5f4', tarjeta: mix([28, 25, 23], hex('#121211'), 0.85) },
  ];
  it.each(casos)('la etiqueta de aviso pasa AA en $tema', ({ tono, texto, tarjeta }) => {
    const tinta = mix(hex(tono), hex(texto), 0.8);
    const fondo = mix(hex(tono), tarjeta, 0.1);
    expect(contrast(tinta, fondo)).toBeGreaterThanOrEqual(4.5);
  });
});
