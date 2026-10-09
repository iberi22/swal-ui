#!/usr/bin/env node
/**
 * Compara una copia vendorizada de @swal/ui con la canonica (este repo).
 *
 *   node scripts/check-vendored-drift.mjs <ruta-copia> [--canonical <ruta>] [--ignore <glob-simple>]...
 *
 * <ruta-copia> es la carpeta del paquete vendorizado (la que contiene src/) o la
 * propia carpeta src/. Compara src/ de forma recursiva, y tokens.css de la raiz
 * de la copia (si existe) contra src/tokens/theme.css canonico.
 *
 * Salida: lista de archivos distintos / faltantes / sobrantes. Exit 0 sin deriva,
 * 1 con deriva, 2 por uso incorrecto.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { resolve, join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
let vendoredArg;
let canonicalArg = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ignores = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--canonical') canonicalArg = resolve(args[++i] ?? '');
  else if (args[i] === '--ignore') ignores.push(args[++i] ?? '');
  else if (args[i] === '-h' || args[i] === '--help') {
    console.log('uso: check-vendored-drift.mjs <ruta-copia> [--canonical <ruta>] [--ignore <subcadena>]...');
    process.exit(0);
  } else if (!vendoredArg) vendoredArg = resolve(args[i]);
  else {
    console.error(`argumento inesperado: ${args[i]}`);
    process.exit(2);
  }
}
if (!vendoredArg) {
  console.error('uso: check-vendored-drift.mjs <ruta-copia> [--canonical <ruta>] [--ignore <subcadena>]...');
  process.exit(2);
}

/** Resuelve la carpeta src/ de un paquete o la propia src/. */
function srcDir(p) {
  if (existsSync(join(p, 'src', 'components'))) return { pkg: p, src: join(p, 'src') };
  if (existsSync(join(p, 'components'))) return { pkg: dirname(p), src: p };
  return null;
}

const canon = srcDir(canonicalArg);
const vend = srcDir(vendoredArg);
if (!canon) { console.error(`no es un paquete @swal/ui canonico: ${canonicalArg}`); process.exit(2); }
if (!vend) { console.error(`no parece una copia de @swal/ui (sin src/components): ${vendoredArg}`); process.exit(2); }

function walk(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, base, out);
    else out.push(relative(base, full).split(sep).join('/'));
  }
  return out;
}

const skip = (f) => ignores.some((s) => f.includes(s));
const canonFiles = new Set(walk(canon.src).filter((f) => !skip(f)));
const vendFiles = new Set(walk(vend.src).filter((f) => !skip(f)));

const different = [];
const missing = [];
const extra = [];
for (const f of canonFiles) {
  if (!vendFiles.has(f)) missing.push(f);
  else if (!readFileSync(join(canon.src, f)).equals(readFileSync(join(vend.src, f)))) different.push(f);
}
for (const f of vendFiles) if (!canonFiles.has(f)) extra.push(f);

// tokens.css de la raiz de la copia debe ser identico al tema canonico.
const rootTokens = join(vend.pkg, 'tokens.css');
if (existsSync(rootTokens) && !skip('tokens.css')) {
  const theme = readFileSync(join(canon.src, 'tokens', 'theme.css'));
  if (!readFileSync(rootTokens).equals(theme)) different.push('(raiz)/tokens.css != src/tokens/theme.css');
}

const total = different.length + missing.length + extra.length;
if (total === 0) {
  console.log(`OK: ${vend.src} coincide con ${canon.src} (${canonFiles.size} archivos)`);
  process.exit(0);
}
console.error(`DERIVA: ${vend.src} difiere de ${canon.src}`);
for (const f of different) console.error(`  distinto  ${f}`);
for (const f of missing) console.error(`  faltante  ${f}`);
for (const f of extra) console.error(`  sobrante  ${f}`);
console.error(`${total} diferencia(s). Refrescar: cp -r ${canon.src}/. ${vend.src}/ (y tokens.css si aplica).`);
process.exit(1);
