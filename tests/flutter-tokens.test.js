import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generate, readTokens, blockTokens, OUT } from '../scripts/gen-flutter-tokens.mjs';

/**
 * Tema "Bone Taller" y su puente a Flutter.
 *
 * flutter/lib/src/tokens.g.dart se GENERA desde theme.css + bone-taller.css.
 * Si alguien toca un token y no regenera, la app Flutter mostraria un tema que
 * la web ya no tiene: este test lo detecta igual que el de deriva de tokens.css.
 */
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf-8');
const layer = read('src/tokens/bone-taller.css');

describe('tokens Flutter (flutter/lib/src/tokens.g.dart)', () => {
  it('el archivo generado esta al dia (si falla: pnpm gen:flutter)', () => {
    expect(read(OUT)).toBe(generate());
  });

  it('lleva la cabecera de archivo generado', () => {
    expect(read(OUT).startsWith('// GENERATED — do not edit.')).toBe(true);
  });

  it('el acento es el naranja de Taller en los dos modos', () => {
    const t = readTokens();
    expect(t.light['--swal-accent'].toLowerCase()).toBe('#ff6a13');
    expect(t.dark['--swal-accent'].toLowerCase()).toBe('#ff6a13');
    // Los neutros siguen siendo Bone.
    expect(t.light['--swal-bg']).toBe('#faf9f5');
    expect(t.dark['--swal-bg']).toBe('#121211');
  });
});

describe('tema bone-taller.css', () => {
  it('solo redefine roles de acento: ningun neutro de Bone', () => {
    const tokens = Object.keys(blockTokens(layer, "[data-accent='taller']"));
    for (const t of tokens) {
      expect(t, t).toMatch(/^--swal-(accent|on-accent|focus-ring|selection)/);
    }
  });

  it('claro y prefers-color-scheme: light son el mismo bloque', () => {
    expect(blockTokens(layer, ":root[data-accent='taller']:not([data-theme])")).toEqual(
      blockTokens(layer, "[data-accent='taller'][data-theme='light']"),
    );
  });

  it('el texto sobre el naranja es piedra oscura, no marfil (2.72:1)', () => {
    const t = readTokens();
    expect(t.light['--swal-on-accent'].toLowerCase()).toBe('#1c1917');
    expect(t.dark['--swal-on-accent'].toLowerCase()).toBe('#1c1917');
  });
});
