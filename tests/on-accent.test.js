/**
 * tests/on-accent.test.js — the foreground-on-accent pair, MEASURED not asserted.
 *
 * Why this file exists. A component in BioHuman (`TabBar.svelte`) asked for
 * `var(--swal-on-accent)`, a token that did not exist in any theme. The
 * declaration was invalid, so the browser dropped it and the icon inherited
 * the parent's colour instead of being chosen for the surface it sits on.
 *
 * The token now exists in the core (`@swal/ui/src/tokens/theme.css`). This
 * test pins two things so the defect cannot come back silently:
 *
 *   1. Every theme that declares `--swal-accent` also declares
 *      `--swal-on-accent`, and it resolves to a real colour, not to nothing.
 *   2. The resolved pair clears WCAG. A static pair is provably sufficient:
 *      sweeping the sRGB cube, the worst case for a near-black/near-white pair
 *      is L=0.1863 at 4.22:1, and a computed token could not do better — it
 *      would choose the same black-or-white. So the pair is checked against
 *      AA for normal text (4.5:1), not merely the 3:1 of WCAG 1.4.11.
 *
 * If someone edits `--swal-accent`, this fails with the real measured ratio
 * and they re-measure rather than assume. That is the point.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
// Comments are stripped first: this file is heavily commented in Spanish, and a
// block comment sitting between two rules would otherwise be captured as part
// of the next selector.
const css = readFileSync(join(here, '..', 'src', 'tokens', 'theme.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '');

/* ── WCAG 2.2 relative luminance and contrast ratio ─────────────────────── */

const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/* ── Parse the theme file ────────────────────────────────────────────────── */

/**
 * Each theme block is a brace-delimited selector. We only care about blocks
 * that declare an accent, and we read the whole block so a value inherited
 * from `:root` is not mistaken for a theme-specific one.
 */
function parseBlocks(source) {
  const blocks = [];
  // Match a selector line, then walk braces by depth. CSS here has no nested
  // at-rules with braces inside a theme block, so depth counting is enough.
  const re = /(^|\n)([^{}@]+)\{/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const selector = m[2].trim().replace(/\s+/g, ' ');
    if (!selector || selector.startsWith('@') || selector.endsWith(',')) continue;
    let depth = 1;
    let i = re.lastIndex;
    while (i < source.length && depth > 0) {
      if (source[i] === '{') depth += 1;
      else if (source[i] === '}') depth -= 1;
      i += 1;
    }
    const body = source.slice(re.lastIndex, i - 1);
    const declared = (name) => (body.match(new RegExp(`${name}:\\s*([^;]+);`)) || [])[1]?.trim();
    const accent = declared('--swal-accent');
    if (!accent) continue;
    blocks.push({
      selector,
      accent,
      onAccent: declared('--swal-on-accent'),
      accentContrast: declared('--swal-accent-contrast'),
    });
  }
  return blocks;
}

/** Resolve one hop of `var(--name)` against the declarations in the same block. */
function resolveAlias(value, block) {
  const inner = value.match(/var\(\s*(--[\w-]+)\s*\)/);
  if (!inner) return value;
  // `--swal-accent-contrast` -> `accentContrast`: drop the `--swal-` namespace
  // prefix that the CSS custom-property syntax carries but the object keys
  // deliberately do not.
  const name = inner[1].replace(/^--swal-/, '').replace(/-(\w)/g, (_, c) => c.toUpperCase());
  const key = Object.keys(block).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? block[key] : undefined;
}

const blocks = parseBlocks(css);
// Every block that declares a literal (non-`var()`) accent is a theme we own.
// Filtering on the value, not on the selector, means the "did I find the
// themes" guard below cannot pass vacuously when the token is missing.
const accentBlocks = blocks.filter((b) => b.accent.startsWith('#'));

/* ── The tests ──────────────────────────────────────────────────────────── */

describe('--swal-on-accent exists wherever an accent is declared', () => {
  it('found the theme blocks that declare --swal-accent', () => {
    // Guards the parser itself: if this drops to 0, the rest would pass vacuously.
    expect(accentBlocks.length).toBeGreaterThanOrEqual(3);
  });

  it.each(accentBlocks.map((b) => [b.selector, b]))(
    '%s declares --swal-on-accent',
    (_selector, block) => {
      expect(
        block.onAccent,
        `${block.selector} sets --swal-accent: ${block.accent} but has no --swal-on-accent, so a component asking for it silently inherits instead`,
      ).toBeDefined();
    },
  );
});

describe('the accent pair is measurable, not guessed', () => {
  it.each(accentBlocks.map((b) => [b.selector, b]))(
    '%s resolves --swal-on-accent to a hex colour',
    (_selector, block) => {
      // The token may be an alias, so resolve one hop. An unresolved var() here
      // means the alias points at a name that does not exist — the exact
      // original defect, one level down.
      const value = resolveAlias(block.onAccent, block);

      expect(
        value,
        `${block.selector}: --swal-on-accent resolves to ${value}, which is not a colour`,
      ).toMatch(/^#[0-9a-f]{3,8}$/i);
    },
  );

  it.each(accentBlocks.map((b) => [b.selector, b]))(
    '%s clears WCAG AA for normal text',
    (_selector, block) => {
      // accent-contrast is an alias of on-accent (or vice versa); resolve one hop
      // so the measurement is taken on the actual colour, never on a `var()`.
      const fg = resolveAlias(block.accentContrast, block);
      const measured = ratio(block.accent, fg);
      expect(
        measured,
        `--swal-on-accent (${fg}) on --swal-accent (${block.accent}) is ${measured.toFixed(2)}:1 — below AA 4.5:1. Re-measure and re-pick the pair, do not relax this.`,
      ).toBeGreaterThanOrEqual(4.5);
    },
  );
});
