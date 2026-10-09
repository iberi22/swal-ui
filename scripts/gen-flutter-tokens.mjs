#!/usr/bin/env node
/**
 * Genera flutter/lib/src/tokens.g.dart a partir de los tokens CSS del tema
 * "Bone Taller", para que la web y el paquete Flutter `swal_ui` no diverjan.
 *
 *   node scripts/gen-flutter-tokens.mjs           escribe el archivo Dart
 *   node scripts/gen-flutter-tokens.mjs --check   exit 1 si esta desactualizado
 *
 * Fuentes (en este orden de fusion, la ultima gana):
 *   1. src/tokens/theme.css       — tema Bone: neutros, semanticos, sombras y el
 *                                   bloque global (radios, espacio, tiempos, fuentes).
 *   2. src/tokens/bone-taller.css — capa de acento: el naranja de Taller sobre Bone.
 *   3. src/tokens/taller.css      — NO se fusiona: se usa para comprobar que el
 *                                   naranja de la capa es el mismo que el de Taller.
 *
 * Sin dependencias: lee el CSS con el mismo extractor de bloques que usan los tests.
 * Tambien se importa desde tests/flutter-tokens.test.js (`generate()`).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const OUT = 'flutter/lib/src/tokens.g.dart';

/** Quita los comentarios: nombran selectores y colores en prosa. */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Tokens --swal-* declarados en el bloque cuyo selector es exactamente `selector`. */
export function blockTokens(css, selector) {
  const src = stripComments(css);
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp(`(^|[}\\s])${escaped}\\s*\\{`).exec(src);
  if (!m) throw new Error(`bloque no encontrado: ${selector}`);
  const open = src.indexOf('{', m.index + m[1].length);
  let depth = 0;
  let end = open;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) {
      end = i;
      break;
    }
  }
  const out = {};
  for (const t of src.slice(open + 1, end).matchAll(/(--swal-[\w-]+)\s*:\s*([^;]+);/g)) {
    out[t[1]] = t[2].replace(/\s+/g, ' ').trim();
  }
  return out;
}

/** Sustituye var(--x[, fallback]) por su valor dentro del mismo mapa. */
function resolveVars(map) {
  const out = {};
  const get = (name, seen = new Set()) => {
    if (seen.has(name)) throw new Error(`referencia circular en ${name}`);
    seen.add(name);
    const raw = map[name];
    if (raw === undefined) return undefined;
    return raw.replace(/var\((--swal-[\w-]+)\s*(?:,\s*([^)]*))?\)/g, (_, ref, fb) => {
      const v = get(ref, new Set(seen));
      if (v !== undefined) return v;
      if (fb !== undefined) return fb.trim();
      throw new Error(`${name} referencia ${ref}, que no existe`);
    });
  };
  for (const k of Object.keys(map)) out[k] = get(k);
  return out;
}

const SELECTORS = {
  boneDark: ":root, [data-theme='dark']",
  boneLight: "[data-theme='light']",
  global: ':root',
  accentDark: "[data-accent='taller']",
  accentLight: "[data-accent='taller'][data-theme='light']",
  accentSystemLight: ":root[data-accent='taller']:not([data-theme])",
  tallerLight: ':root[data-theme="taller"]',
  tallerDark: ':root[data-theme="taller-dark"]',
};

/** Tokens del acento que DEBEN coincidir con taller.css (el vinculo entre los dos temas). */
const LINKED_TO_TALLER = ['--swal-accent', '--swal-accent-hover', '--swal-accent-muted', '--swal-accent-text'];

const norm = (v) => v.toLowerCase().replace(/\s+/g, '');

/** Lee los tres CSS y devuelve los mapas fusionados y resueltos por modo. */
export function readTokens(root = ROOT) {
  const read = (p) => readFileSync(resolve(root, p), 'utf-8');
  // theme.css separa el selector del modo oscuro en dos lineas: se normaliza.
  const theme = read('src/tokens/theme.css').replace(/:root,\s*\n\s*\[data-theme='dark'\]/, ":root, [data-theme='dark']");
  const layer = read('src/tokens/bone-taller.css');
  const taller = read('src/tokens/taller.css');

  const global = blockTokens(theme, SELECTORS.global);
  const accentLight = blockTokens(layer, SELECTORS.accentLight);
  const accentSystem = blockTokens(layer, SELECTORS.accentSystemLight);
  if (JSON.stringify(accentLight) !== JSON.stringify(accentSystem)) {
    throw new Error('bone-taller.css: el bloque claro y el de prefers-color-scheme: light divergen');
  }

  const modes = {
    light: { bone: SELECTORS.boneLight, accent: accentLight, taller: SELECTORS.tallerLight },
    dark: { bone: SELECTORS.boneDark, accent: blockTokens(layer, SELECTORS.accentDark), taller: SELECTORS.tallerDark },
  };
  const out = { global: resolveVars(global) };
  for (const [mode, cfg] of Object.entries(modes)) {
    const tallerTokens = blockTokens(taller, cfg.taller);
    for (const name of LINKED_TO_TALLER) {
      if (!cfg.accent[name] || norm(cfg.accent[name]) !== norm(tallerTokens[name] ?? '')) {
        throw new Error(
          `bone-taller.css (${mode}) ${name} = ${cfg.accent[name]} no coincide con taller.css ${cfg.taller} = ${tallerTokens[name]}. ` +
            'Copia el valor de Taller a bone-taller.css y vuelve a generar.',
        );
      }
    }
    out[mode] = resolveVars({ ...global, ...blockTokens(theme, cfg.bone), ...cfg.accent });
  }
  return out;
}

// ─── Conversores CSS → Dart ────────────────────────────────────────────────

const hex2 = (n) => n.toString(16).toUpperCase().padStart(2, '0');

/** '#rgb' | '#rrggbb' | '#rrggbbaa' | 'rgb(a)(r, g, b[, a])' → 'Color(0xAARRGGBB)'. */
export function dartColor(value) {
  const v = value.trim();
  let r;
  let g;
  let b;
  let a = 1;
  let m;
  if ((m = /^#([0-9a-f]{3})$/i.exec(v))) {
    [r, g, b] = [...m[1]].map((c) => parseInt(c + c, 16));
  } else if ((m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(v))) {
    [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
    if (m[2]) a = parseInt(m[2], 16) / 255;
  } else if ((m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(v))) {
    [r, g, b] = [m[1], m[2], m[3]].map(Number);
    if (m[4] !== undefined) a = Number(m[4]);
  } else {
    throw new Error(`color no soportado: ${value}`);
  }
  return `Color(0x${hex2(Math.round(a * 255))}${hex2(r)}${hex2(g)}${hex2(b)})`;
}

const px = (v) => {
  const t = v.trim();
  if (t === '0') return 0;
  const m = /^(-?[\d.]+)(px|rem)$/.exec(t);
  if (!m) throw new Error(`longitud no soportada: ${v}`);
  return Number(m[1]) * (m[2] === 'rem' ? 16 : 1);
};

/** Numero Dart de tipo double, sin ceros de sobra: 4 → 4.0, 0.5 → 0.5. */
const dbl = (n) => (Number.isInteger(n) ? `${n}.0` : String(n));
const num = (n) => String(n);

/** 'X Y BLUR [SPREAD] COLOR[, ...]' → lineas Dart de BoxShadow. */
function dartShadows(value) {
  return value.split(/,(?![^(]*\))/).map((part) => {
    const m = /^\s*((?:-?[\d.]+(?:px)?\s+){2,4})(rgba?\([^)]*\)|#[0-9a-f]+)\s*$/i.exec(part);
    if (!m) throw new Error(`sombra no soportada: ${part}`);
    const [x, y, blur = 0, spread = 0] = m[1].trim().split(/\s+/).map(px);
    const args = [`color: ${dartColor(m[2])}`, `offset: Offset(${num(x)}, ${num(y)})`, `blurRadius: ${num(blur)}`];
    if (spread) args.push(`spreadRadius: ${num(spread)}`);
    return args;
  });
}

const ms = (v) => {
  const m = /^([\d.]+)(ms|s)\b/.exec(v.trim());
  if (!m) throw new Error(`duracion no soportada: ${v}`);
  return Number(m[1]) * (m[2] === 's' ? 1000 : 1);
};

const cubic = (v) => {
  const m = /cubic-bezier\(([^)]*)\)/.exec(v);
  if (!m) throw new Error(`curva no soportada: ${v}`);
  return `Cubic(${m[1].split(',').map((n) => num(Number(n))).join(', ')})`;
};

const GENERIC_FAMILIES = new Set(['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif', 'ui-monospace', 'monospace']);
const families = (v) =>
  v
    .split(',')
    .map((f) => f.trim().replace(/^['"]|['"]$/g, ''))
    .filter((f) => f && !GENERIC_FAMILIES.has(f));

// ─── Mapeo token CSS → campo Dart ─────────────────────────────────────────

/** [token CSS, campo de SwalPalette]. El orden es el del constructor. */
export const PALETTE_COLORS = [
  ['--swal-bg', 'bg'],
  ['--swal-surface', 'surface'],
  ['--swal-surface-hover', 'surfaceHover'],
  ['--swal-surface-active', 'surfaceActive'],
  ['--swal-elevated', 'elevated'],
  ['--swal-overlay', 'overlay'],
  ['--swal-void', 'voidColor'],
  ['--swal-border', 'border'],
  ['--swal-border-light', 'borderLight'],
  ['--swal-border-strong', 'borderStrong'],
  ['--swal-text', 'text'],
  ['--swal-text-secondary', 'textSecondary'],
  ['--swal-text-muted', 'textMuted'],
  ['--swal-text-faint', 'textFaint'],
  ['--swal-text-inverse', 'textInverse'],
  ['--swal-hover', 'hover'],
  ['--swal-accent', 'accent'],
  ['--swal-accent-hover', 'accentHover'],
  ['--swal-accent-muted', 'accentMuted'],
  ['--swal-accent-text', 'accentText'],
  ['--swal-on-accent', 'onAccent'],
  ['--swal-focus-ring', 'focusRing'],
  ['--swal-selection', 'selection'],
  ['--swal-success', 'success'],
  ['--swal-warning', 'warning'],
  ['--swal-danger', 'danger'],
  ['--swal-info', 'info'],
  ['--swal-success-muted', 'successMuted'],
  ['--swal-warning-muted', 'warningMuted'],
  ['--swal-danger-muted', 'dangerMuted'],
  ['--swal-info-muted', 'infoMuted'],
  ['--swal-on-danger', 'onDanger'],
];
export const PALETTE_SHADOWS = [
  ['--swal-shadow-sm', 'shadowSm'],
  ['--swal-shadow', 'shadow'],
  ['--swal-shadow-lg', 'shadowLg'],
];

const camel = (name) => name.replace(/^--swal-/, '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

function need(map, name, where) {
  const v = map[name];
  if (v === undefined) throw new Error(`falta ${name} en ${where}`);
  return v;
}

function paletteConst(constName, brightness, map) {
  const lines = [`const SwalPalette ${constName} = SwalPalette(`, `  brightness: Brightness.${brightness},`];
  for (const [token, field] of PALETTE_COLORS) {
    lines.push(`  ${field}: ${dartColor(need(map, token, brightness))}, // ${token}`);
  }
  for (const [token, field] of PALETTE_SHADOWS) {
    lines.push(`  // ${token}: ${need(map, token, brightness)}`);
    lines.push(`  ${field}: <BoxShadow>[`);
    for (const args of dartShadows(map[token])) {
      // Igual que `dart format` (80 columnas): en una linea si cabe.
      const flat = `    BoxShadow(${args.join(', ')}),`;
      if (flat.length <= 80) {
        lines.push(flat);
        continue;
      }
      lines.push('    BoxShadow(');
      for (const a of args) lines.push(`      ${a},`);
      lines.push('    ),');
    }
    lines.push('  ],');
  }
  lines.push(');');
  return lines.join('\n');
}

function globalsClass(g) {
  const L = [];
  const field = (type, name, value, token) => {
    L.push(`  /// \`${token}: ${g[token]}\``);
    L.push(`  static const ${type} ${name} = ${value};`);
    L.push('');
  };
  for (const token of Object.keys(g).filter((k) => /^--swal-radius/.test(k))) {
    field('double', camel(token), dbl(px(g[token])), token);
  }
  const spaces = Object.keys(g)
    .filter((k) => /^--swal-space-\d+$/.test(k))
    .sort((a, b) => Number(a.split('-').pop()) - Number(b.split('-').pop()));
  for (const token of spaces) field('double', camel(token), dbl(px(g[token])), token);
  for (const token of Object.keys(g).filter((k) => /^--swal-font-size/.test(k))) {
    field('double', camel(token), dbl(px(g[token])), token);
  }
  for (const [token, name] of [
    ['--swal-transition-fast', 'durationFast'],
    ['--swal-transition', 'duration'],
    ['--swal-transition-slow', 'durationSlow'],
  ]) {
    field('Duration', name, `Duration(milliseconds: ${ms(need(g, token, 'global'))})`, token);
  }
  field('Cubic', 'easeStandard', cubic(need(g, '--swal-transition', 'global')), '--swal-transition');
  field('Cubic', 'easeOut', cubic(need(g, '--swal-ease-out', 'global')), '--swal-ease-out');
  field('Cubic', 'easeIn', cubic(need(g, '--swal-ease-in', 'global')), '--swal-ease-in');
  // Igual que `dart format`: la lista en una linea si cabe en 80 columnas.
  const list = (name, xs) => {
    const items = xs.map((f) => `'${f}'`);
    const flat = `<String>[${items.join(', ')}]`;
    if (`  static const List<String> ${name} = ${flat};`.length <= 80) return flat;
    return `<String>[\n${items.map((i) => `    ${i},`).join('\n')}\n  ]`;
  };
  field('List<String>', 'fontSans', list('fontSans', families(need(g, '--swal-font', 'global'))), '--swal-font');
  field('List<String>', 'fontMono', list('fontMono', families(need(g, '--swal-font-mono', 'global'))), '--swal-font-mono');
  while (L[L.length - 1] === '') L.pop();
  return L;
}

/** Contenido completo de tokens.g.dart. Determinista: sin fechas ni rutas absolutas. */
export function generate(root = ROOT) {
  const t = readTokens(root);
  return [
    '// GENERATED — do not edit.',
    '// Fuente: src/tokens/theme.css (Bone) + src/tokens/bone-taller.css (acento',
    '// naranja de src/tokens/taller.css). Regenerar con `pnpm gen:flutter`;',
    '// tests/flutter-tokens.test.js falla si este archivo queda desactualizado.',
    '',
    "import 'package:flutter/material.dart';",
    '',
    "import 'palette.dart';",
    '',
    '/// Bone Taller claro — Papel Alabastro + naranja Taller.',
    paletteConst('swalPaletteLight', 'light', t.light),
    '',
    '/// Bone Taller oscuro — Carbon Mineral + naranja Taller.',
    paletteConst('swalPaletteDark', 'dark', t.dark),
    '',
    '/// Tokens independientes del tema (bloque `:root` global de theme.css).',
    'abstract final class SwalTokenValues {',
    ...globalsClass(t.global),
    '}',
    '',
  ].join('\n');
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  const target = resolve(ROOT, OUT);
  const next = generate();
  if (process.argv.includes('--check')) {
    let current = '';
    try {
      current = readFileSync(target, 'utf-8');
    } catch {}
    if (current !== next) {
      console.error(`${OUT} esta desactualizado: ejecuta \`pnpm gen:flutter\`.`);
      process.exit(1);
    }
    console.log(`${OUT} al dia.`);
  } else {
    writeFileSync(target, next);
    console.log(`escrito ${OUT}`);
  }
}
