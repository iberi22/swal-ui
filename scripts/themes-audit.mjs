#!/usr/bin/env node
/**
 * Auditor de temas SWAL.
 *
 * Comprueba dos cosas que se rompen solas con el tiempo:
 *
 *   1. CONTRATO — que cada tema del core defina los tokens semanticos completos
 *      y que sus pares texto/fondo pasen WCAG 2.2 AA. Un tema que solo define
 *      el fondo y deja el texto del anterior no es un tema: es un bug esperando.
 *
 *   2. MIGRACION — que ninguna app siga importing un theme.css viejo por su
 *      cuenta. Bone es el tema del ecosistema y se entra por themes.css, no
 *      por el fichero de tokens.
 *
 * Uso:  node scripts/themes-audit.mjs           # audita el core
 *       node scripts/themes-audit.mjs --ecosistema   # ademas busca apps que
 *                                                    # importen temas a mano
 *
 * Sale con 1 si encuentra algo que arreglar, 0 si todo esta bien.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS = join(ROOT, 'src/tokens');

/**
 * Tokens de COLOR que un tema debe definir. Son los que cambian con el tema.
 *
 * La tipografia y la geometria (--swal-font, --swal-font-mono, --swal-radius)
 * NO se exigen aqui a proposito: viven en la capa base de theme.css porque no
 * cambian entre claro y oscuro. Exigirlos por modo seria exigir algo que el
 * diseno de Bone hace bien. Se comprueban aparte, una vez, abajo.
 */
const CONTRATO = [
  '--swal-bg',
  '--swal-surface',
  '--swal-text',
  '--swal-text-secondary',
  '--swal-text-muted',
  '--swal-border',
  '--swal-accent',
  '--swal-accent-contrast',
  '--swal-success',
  '--swal-warning',
  '--swal-danger',
];

/** Tokens que deben existir una vez en la capa base, no por modo. */
const BASE = ['--swal-font', '--swal-font-mono', '--swal-radius'];

/** Pares que deben pasar contraste. [token_texto, token_fondo, etiqueta] */
const PARES = [
  ['--swal-text', '--swal-bg', 'texto principal sobre fondo'],
  ['--swal-text-secondary', '--swal-bg', 'texto secundario sobre fondo'],
  ['--swal-text-muted', '--swal-bg', 'texto tenue sobre fondo'],
  ['--swal-text', '--swal-surface', 'texto principal sobre superficie'],
  ['--swal-accent-contrast', '--swal-accent', 'texto sobre acento'],
  ['--swal-success', '--swal-bg', 'exito sobre fondo'],
  ['--swal-warning', '--swal-bg', 'alerta sobre fondo'],
  ['--swal-danger', '--swal-bg', 'peligro sobre fondo'],
];

// ── Color ───────────────────────────────────────────────────────────────────

/** Resuelve un token a color plano. Devuelve null si no es resoluble. */
function aColor(token, ambito, resolverVar) {
  let v = token;
  // expande una o dos veces: --x: var(--y), y --y: var(--z)
  for (let i = 0; i < 3 && v.startsWith('var('); i++) {
    const ref = v.slice(4, v.indexOf(')')).trim();
    v = resolverVar(ref, ambito);
    if (v === undefined) return null;
  }
  return aRGBA(v);
}

function aRGBA(css) {
  if (!css) return null;
  css = css.trim();

  const hex = css.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4)
      h = [...h].map((c) => c + c).join('');
    const n = [0, 2, 4, 6]
      .map((i) => (i < h.length ? h.slice(i, i + 2) : null))
      .map((par) => (par === null ? 255 : parseInt(par, 16)));
    if (n.some(Number.isNaN)) return null;
    return {
      r: n[0], g: n[1], b: n[2],
      a: h.length === 8 ? n[3] / 255 : 1,
    };
  }

  const rgb = css.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)\s*(?:[,/]\s*([\d.%]+)\s*)?\)$/i);
  if (rgb) {
    const a = rgb[4] === undefined ? 1
      : rgb[4].endsWith('%') ? parseFloat(rgb[4]) / 100
      : parseFloat(rgb[4]);
    return { r: +rgb[1], g: +rgb[2], b: +rgb[3], a };
  }
  return null; // color-mix(), lab(), currentColor… fuera de alcance
}

/** Compone fg con alfa sobre un fondo opaco. */
function componer(fg, bg) {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

/** Luminancia relativa WCAG 2.2. */
function luminancia({ r, g, b }) {
  const f = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** Razon de contraste WCAG 2.2. */
function contraste(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Etiqueta de conformidad. 4.5 es el umbral para texto normal. */
function nivel(r) {
  if (r >= 7) return 'AAA';
  if (r >= 4.5) return 'AA';
  if (r >= 3) return 'AA-large';
  return 'FALLA';
}

// ── Lectura de CSS ──────────────────────────────────────────────────────────

/**
 * Extrae `{ token: valor }` de un bloque `{ … }` concreto.
 *
 * Dos trampas que ya han mordido aqui y por eso se resuelven explicitamente:
 *
 *  · theme.css tiene TRES bloques cuyo selector empieza por :root
 *    (`:root,\n[data-theme='dark']`, `:root:not([data-theme])` y `:root`). Una
 *    busqueda ingenua devuelve el primero, que es el de color, no la capa base.
 *    Por eso se exige que el selector este SOLO en la linea, precedido de salto
 *    y seguido de `{` inmediato.
 *
 *  · Los comentarios CSS contienen llaves y texto que parece un selector
 *    (`:root que el sistema haya elegido`). Se ignoran comentarios antes de
 *    buscar.
 */
function bloque(css, selector) {
  const sinComentarios = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = sinComentarios.match(
    new RegExp(`(?:^|[}\\n\\s])${esc}\\s*\\{([^{}]*)\\}`, 'm')
  );
  if (!m) return null;
  const out = {};
  for (const t of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[t[1]] = t[2].trim();
  return out;
}

function cargarTokens(selector) {
  const fuente = readFileSync(join(TOKENS, 'theme.css'), 'utf8');
  const base = bloque(fuente, selector);
  if (!base) return null;
  // :root sin atributo es el fallback de Bone.
  const raiz = bloque(fuente, ':root:not([data-theme])') ?? {};
  return { ...raiz, ...base };
}

function resolverVar(nombre, ambito) {
  return ambito[nombre];
}

// ── Auditoría ───────────────────────────────────────────────────────────────

const problemas = [];
const avisos = [];

console.log('\n  \x1b[1mAuditor de temas SWAL\x1b[0m  ·  Bone es el tema por defecto\n');

const MODOS = [
  ["[data-theme='dark']", 'oscuro'],
  ["[data-theme='light']", 'claro'],
];

for (const [selector, nombre] of MODOS) {
  const ambito = cargarTokens(selector);
  if (!ambito) {
    problemas.push(`theme.css no define ${selector}`);
    continue;
  }

  const faltan = CONTRATO.filter((t) => !(t in ambito));
  if (faltan.length) {
    problemas.push(`${nombre}: le faltan ${faltan.length} tokens del contrato — ${faltan.join(' ')}`);
  }

  // Contraste: solo si hay fondo opaco donde medir.
  const bg = aColor(ambito['--swal-bg'] ?? '', ambito, resolverVar);
  if (!bg || bg.a < 1) {
    avisos.push(`${nombre}: --swal-bg no es opaco (${ambito['--swal-bg']}), no se mide contraste`);
  } else {
    for (const [tk, tkFondo, etiqueta] of PARES) {
      const vFondo = tk === tkFondo ? ambito['--swal-bg'] : ambito[tkFondo];
      const cFondo = tk === tkFondo ? bg : aColor(vFondo ?? '', ambito, resolverVar);
      if (!cFondo) continue;
      const real = cFondo.a < 1 ? componer(cFondo, bg) : cFondo;
      const cTexto = aColor(ambito[tk] ?? '', ambito, resolverVar);
      if (!cTexto) continue;
      const sobre = cTexto.a < 1 ? componer(cTexto, real) : cTexto;
      const r = contraste(sobre, real);
      if (r < 4.5) {
        problemas.push(
          `${nombre}: ${etiqueta} ${r.toFixed(2)}:1 (${nivel(r)}) — ${tk} sobre ${tkFondo}`
        );
      } else {
        console.log(
          `  \x1b[32mok\x1b[0m   ${nombre.padEnd(6)} ${etiqueta.padEnd(34)} ${r.toFixed(2).padStart(6)}:1 ${nivel(r)}`
        );
      }
    }
  }
}

// ── Capa base: tipografia y geometria ───────────────────────────────────────
// Se declaran una vez en :root y no por modo, a proposito. Si desaparecen,
// ningun tema puede construirse encima.
{
  const fuente = readFileSync(join(TOKENS, 'theme.css'), 'utf8');
  const raiz = bloque(fuente, ':root') ?? {};
  const faltan = BASE.filter((t) => !(t in raiz));
  if (faltan.length) {
    problemas.push(`capa base: faltan ${faltan.length} token(s) — ${faltan.join(' ')}`);
  } else {
    console.log('  \x1b[32mok\x1b[0m   base    tipografia y geometria definidas una vez');
  }
}

/**
 * El propio core no es una app que migra: es el sistema.
 *
 * Se excluyen solo los ficheros de tokens y themes.css, que son justo lo que
 * el auditor busca. Todo lo demas bajo la carpeta del core se audita como
 * cualquier app, y el demo va incluido a proposito: hoy importa
 * `../src/tokens/theme.css` a mano, que es la infraccion mas visible del
 * repositorio y no puede quedar tapada por una exclusion de carpeta.
 *
 * El nombre `themes.css` cubre el caso del worktree detached
 * (`git worktree add --detach`), donde la ruta es `scratch/algo-XXXXXX/` y no
 * lleva el nombre del paquete.
 */
function esElSistema(rel, nombre) {
  if (/(^|\/)(src\/)?tokens\//.test(rel)) return true;
  return nombre === 'themes.css';
}

// ── Ecosistema: nadie importa un tema a mano ───────────────────────────────

if (process.argv.includes('--ecosistema')) {
  const raizEcosistema = resolve(ROOT, '..', '..');
  const IGNORAR = new Set(['node_modules', '.git', 'dist', 'build', 'target', '.svelte-kit', 'vendor', '.astro']);
  const importaciones = [];

  (function caminar(dir, prof) {
    if (prof > 7 || !existsSync(dir)) return;
    let entradas;
    try { entradas = readdirSync(dir); } catch { return; }
    for (const e of entradas) {
      if (e.startsWith('.') && e !== '.') continue;
      if (IGNORAR.has(e)) continue;
      const p = join(dir, e);
      let s;
      try { s = statSync(p); } catch { continue; }
      if (s.isDirectory()) caminar(p, prof + 1);
      else if (/\.(css|scss|svelte|astro|ts|js|html)$/.test(e)) {
        let txt;
        try { txt = readFileSync(p, 'utf8'); } catch { return; }
        // Un import de tokens/ o de theme.css propio es el antipatron.
        // El antipatron tiene dos formas. La obvia es un @import de CSS, pero
        // desde JS es igual de valido y mas habitual en un proyecto Svelte/Vite:
        //
        //     import '@swal/ui/tokens';
        //     import '../src/tokens/theme.css';
        //
        // Mirar solo @import dejaba pasar el caso que mas se da en la practica:
        // el entry del demo del propio core. Se buscan las dos.
        const patron =
          /@import\s+(?:url\()?['"]?[^'")]*(tokens\/(theme|tikpro|antigravity)\.css)/.test(txt) ||
          /@import\s+['"]@swal\/ui\/tokens\//.test(txt) ||
          /(?:^|\n)\s*import\s+(?:[^'"]*from\s+)?['"][^'"]*(tokens\/(theme|tikpro|antigravity)\.css|\/tokens)['"]/.test(txt) ||
          /(?:^|\n)\s*import\s+['"]@swal\/ui\/(tokens|tikpro\.css|antigravity\.css|colors)['"]/.test(txt);
        if (!patron) continue;

        // El propio themes.css del core menciona el patron al documentarlo, y
        // los ficheros de tokens son justo lo que se busca. No son una app
        // que migra: son el sistema.
        const rel = p.replace(raizEcosistema + '/', '');
        if (esElSistema(rel, e)) continue;

        importaciones.push(rel);
      }
    }
  })(raizEcosistema, 0);

  if (importaciones.length) {
    problemas.push(
      `${importaciones.length} fichero(s) importan un tema a mano en vez de '@swal/ui/themes.css':\n` +
      importaciones.map((f) => `        ${f}`).join('\n')
    );
  } else {
    console.log('  \x1b[32mok\x1b[0m   ninguna app importa tokens sueltos');
  }
}

// ── Resultado ───────────────────────────────────────────────────────────────

for (const a of avisos) console.log(`  \x1b[33maviso\x1b[0m ${a}`);

if (problemas.length) {
  console.log(`\n  \x1b[31m✗ ${problemas.length} problema(s)\x1b[0m`);
  for (const p of problemas) console.log(`      ${p}`);
  console.log('');
  process.exit(1);
}

console.log('\n  \x1b[32m✓ Bone cumple el contrato y pasa AA en claro y oscuro\x1b[0m\n');
