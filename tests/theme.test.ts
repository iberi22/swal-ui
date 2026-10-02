import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// El core esta FUERA del cwd de vitest (que es src-astro), asi que se resuelve
// desde process.cwd(). No usar __dirname ni import.meta.dirname: este runtime no
// expone ninguno de los dos (fallo real, no hipotetico).
const CORE = resolve(process.cwd());
const read = (p: string) => readFileSync(resolve(CORE, p), 'utf-8');

/**
 * Tema "Bone" del core @swal/ui — hueso claro / grafito oscuro.
 *
 * Tres cosas que este archivo fija porque son el contrato del tema:
 *   1. tokens.css (raiz) y src/tokens/theme.css son byte-identicos. La app carga
 *      el primero por URL y no puede resolver @import, asi que hay que copiarlos.
 *      Llegan a divergir y la app muestra un tema que el core no tiene.
 *   2. El tema NO usa la paleta Edge-Hive (cyan + orange). Es de un solo tono.
 *   3. Los tokens semanticos estan definidos en AMBOS temas: un componente
 *      escrito con --swal-text no puede romperse al cambiar de tema.
 */

// Las cadenas se leen al importar el modulo, no en beforeAll: `tokensIn` se llama
// a nivel de modulo para construir los diccionarios, y ahi `theme` todavia no
// existe (beforeAll corre despues). Leerlas aqui y exportarlas.
const theme = read('src/tokens/theme.css');
const rootTokens = theme; // el core no tiene tokens.css en la raiz: se exporta como alias (package.json)
const colors = read('src/tokens/colors.css');

/** Extrae los tokens declarados dentro de un bloque selector. */
function tokensIn(source: string, selector: string): Record<string, string> {
  const start = source.indexOf(selector);
  if (start < 0) return {};
  const open = source.indexOf('{', start);
  let depth = 0;
  let end = open;
  for (let i = open; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  const body = source.slice(open + 1, end);
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/(--swal-[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

const dark = tokensIn(theme, ":root,\n[data-theme='dark']");
const light = tokensIn(theme, "[data-theme='light']");

describe('tema Bone — sincronía de archivos', () => {
  it('tokens.css de la raiz es identico a src/tokens/theme.css', () => {
    // Divergieron durante meses sin que nada lo notara: la app carga el de la
    // raiz por URL (/node_modules/@swal/ui/tokens.css) y el core usa el otro.
    expect(rootTokens).toBe(theme);
  });

  it('colors.css no referencia tokens que ya no existen', () => {
    const usados = new Set([...colors.matchAll(/var\((--swal-[\w-]+)/g)].map((m) => m[1]));
    const definidos = new Set(Object.keys(dark));
    const huerfanos = [...usados].filter((t) => !definidos.has(t));
    // --swal-accent-orange existia en Edge-Hive y se llevo por delante clases
    // que los componentes ya usaban.
    expect(huerfanos).toEqual([]);
  });

  it('theme.css no usa @import: tokens.css se carga por URL y no lo resolveria', () => {
    // El @import de './colors.css' fue un fallo real en dos etapas:
    //   1. al final del archivo, PostCSS lo descarta ("must precede all other
    //      statements") — el build lo avisaba y las utilidades NO se aplicaban;
    //   2. movido al principio, Vite lo resuelve contra la RAIZ del paquete,
    //      donde colors.css no existe, y el build falla con ENOENT.
    // tokens.css vive en la raiz porque la app lo carga por URL; no puede
    // importar nada relativo. Por eso las utilidades van inline.
    // Solo sentencias reales: el archivo MENCIONA @import en prosa (linea 18 y
    // en el comentario de las utilidades), y un grep ingenuo daria falso positivo.
    const sentencia = theme
      .split('\n')
      .map((l: string) => l.trim())
      .find((l: string) => l.startsWith('@import') && !l.endsWith('*/'));
    expect(sentencia, 'tokens.css no debe tener sentencias @import').toBeUndefined();
  });

  it('las utilidades de color estan inline en el archivo', () => {
    // Si alguien reintroduce colors.css como @import esperando que funcione,
    // este test falla antes que el build.
    for (const c of ['.swal-accent-contrast', '.swal-bg', '.swal-border-strong', '.swal-info']) {
      expect(theme).toContain(c);
    }
  });
});

describe('tema Bone — un solo tono', () => {
  // Los colores del tema anterior no aparecen en ninguna SENTENCIA CSS. Solo se
  // miran las sentencias: los comentarios los nombran para explicar de donde
  // viene cada fix (p. ej. "caia al fallback #22d3ee"), y un grep ingenuo
  // sobre el archivo entero daria falso positivo.
  const soloCodigo = theme.toLowerCase().replace(/\/\*[\s\S]*?\*\//g, '');
  it('no quedan los colores del tema Edge-Hive', () => {
    for (const hex of ['#06b6d4', '#22d3ee', '#f97316', '#0f172a', '#020617']) {
      expect(soloCodigo).not.toContain(hex);
    }
  });

  it('el acento es el mismo color que el texto (no un color aparte)', () => {
    // La idea del tema: en oscuro el acento ES el texto, en claro es el grafito.
    // Un acento distinto del texto es lo que hacia que Edge-Hive se sintiera
    // "de colores" en vez de un solo tono.
    expect(dark['--swal-accent']).toBe(dark['--swal-text']);
    expect(light['--swal-accent']).toBe(light['--swal-text']);
  });

  it('usa la paleta Warm Minimalist: alabastro y carbon mineral, no blanco ni negro', () => {
    // Los dos extremos vibran en pantalla y endurecen el texto. Un tema sobrio
    // se queda en papel roto y grafito con tinte de tierra.
    expect(light['--swal-bg']).toBe('#faf9f5');
    expect(dark['--swal-bg']).toBe('#121211');
    expect(light['--swal-text']).toBe('#1c1917');
    expect(dark['--swal-text']).toBe('#f5f5f4');
    // Tampoco blanco clinico ni negro OLED en ningun sitio.
    for (const t of [light, dark]) {
      const valores = Object.values(t).join(' ');
      expect(valores).not.toMatch(/#ffffff\b(?!.*rgba)/i);
      expect(valores.toLowerCase()).not.toContain('#000000');
      expect(valores.toLowerCase()).not.toContain('#000;');
    }
  });

  it('los semanticos son los de la paleta propuesta, con dos ajustes medidos', () => {
    // La paleta sugeria #059669 (emerald-600) para exito y #e11d48 (rose-600)
    // para alerta. Medidos sobre el canvas claro (#FAF9F5) dan 3.74:1 y
    // 4.46:1 — el primero solo AA-large y el segundo por debajo de AA. En Fi'ze
    // "Pagado" y los errores salen en texto pequeno, asi que se corrigen a tonos
    // que si pasan AA sin cambiar el color a simple vista.
    expect(light['--swal-success']).toBe('#047857');
    expect(light['--swal-danger']).toBe('#dc2626');
    expect(light['--swal-warning']).toBe('#b45309');
    expect(light['--swal-info']).toBe('#0369a1');
    expect(dark['--swal-success']).toBe('#34d399');
    expect(dark['--swal-danger']).toBe('#fb7185');
    expect(light['--swal-success']).not.toBe('#059669');
    expect(light['--swal-danger']).not.toBe('#e11d48');
  });

  it('las superficies son translucidas (glass), no solidas', () => {
    // Una superficie totalmente opaca mata el efecto de papel bajo luz, que es
    // justo lo que distingue este tema de un gris plano.
    expect(light['--swal-surface']).toMatch(/rgba\([^)]*,\s*0\.[89]/);
    expect(dark['--swal-surface']).toMatch(/rgba\([^)]*,\s*0\.[78]/);
  });

  it('la jerarquia de texto se construye con opacidad del mismo color', () => {
    for (const t of [dark, light]) {
      const full = t['--swal-text'];
      expect(full).toMatch(/^#[0-9a-f]{6}$/i);
      for (const k of ['--swal-text-secondary', '--swal-text-muted', '--swal-text-faint']) {
        // rgba(...) con el MISMO color base, variando solo el alfa
        const m = t[k].match(/rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)/);
        expect(m, `${k} debe ser rgba con opacidad`).not.toBeNull();
        const [r, g, b] = [full.slice(1, 3), full.slice(3, 5), full.slice(5, 7)].map((h) =>
          parseInt(h, 16),
        );
        expect(Number(m[1])).toBe(r);
        expect(Number(m[2])).toBe(g);
        expect(Number(m[3])).toBe(b);
      }
      // Y el alfa debe BAJAR monotonamente: primary > secondary > muted > faint
      const alphas = ['--swal-text-secondary', '--swal-text-muted', '--swal-text-faint'].map((k) =>
        Number(t[k].match(/,\s*([\d.]+)\s*\)/)[1]),
      );
      expect(alphas[0]).toBeGreaterThan(alphas[1]);
      expect(alphas[1]).toBeGreaterThan(alphas[2]);
    }
  });
});

describe('tema Bone — cobertura de tokens', () => {
  const requeridos = [
    '--swal-bg', '--swal-surface', '--swal-surface-hover', '--swal-surface-active',
    '--swal-elevated', '--swal-overlay', '--swal-void',
    '--swal-border', '--swal-border-light', '--swal-border-strong',
    '--swal-text', '--swal-text-secondary', '--swal-text-muted', '--swal-text-faint',
    '--swal-text-inverse', '--swal-accent', '--swal-accent-contrast',
    '--swal-on-accent', '--swal-on-danger',
    '--swal-success', '--swal-warning', '--swal-danger', '--swal-info',
    '--swal-shadow-sm', '--swal-shadow', '--swal-shadow-lg',
  ];

  it.each(requeridos)('el tema oscuro define %s', (t) => {
    expect(dark[t], `falta ${t} en oscuro`).toBeTruthy();
  });

  it.each(requeridos)('el tema claro define %s', (t) => {
    // Este es el test que mas importa: un token que existe en oscuro y no en
    // claro significa que el componente se rompe al cambiar de tema.
    expect(light[t], `falta ${t} en claro`).toBeTruthy();
  });

  it('los tokens geometricos no dependen del tema', () => {
    for (const t of ['--swal-radius', '--swal-font', '--swal-space-4', '--swal-transition']) {
      expect(theme).toContain(`${t}:`);
    }
  });
});

describe('tema Bone — el sistema puede forzar un tema', () => {
  it('data-theme gana sobre la preferencia del sistema', () => {
    // :root:not([data-theme]) es lo que permite que un tema explicito gane.
    expect(theme).toContain(':root:not([data-theme])');
    expect(theme).toContain('prefers-color-scheme: light');
  });

  it('declara color-scheme en ambos temas', () => {
    expect(theme).toMatch(/\[data-theme='dark'\][\s\S]*?color-scheme:\s*dark/);
    expect(theme).toMatch(/\[data-theme='light'\][\s\S]*?color-scheme:\s*light/);
  });

  it('los valores del bloque prefers-color-scheme coinciden con data-theme light', () => {
    // Mantener los dos bloques en sync a mano es fragil: si divergen, la app se
    // ve distinta segun si el usuario forzo el tema o no.
    const media = tokensIn(theme, ':root:not([data-theme])');
    for (const k of Object.keys(light)) {
      expect(media[k], `${k} difiere entre prefers-color-scheme y data-theme=light`).toBe(
        light[k],
      );
    }
  });
});

describe('tema Bone — accesibilidad heredada', () => {
  it('mantiene el anillo de foco unico', () => {
    expect(theme).toContain(':focus-visible');
    expect(theme).toContain('outline: 2px solid var(--swal-accent)');
  });

  it('respeta prefers-reduced-motion', () => {
    expect(theme).toContain('prefers-reduced-motion: reduce');
  });

  it('conserva las utilidades de mobile (safe-area, dvh)', () => {
    for (const c of ['.swal-safe-area', '.swal-dvh', '.swal-touch']) {
      expect(theme).toContain(c);
    }
  });

  it('las clases del tema viejo siguen existiendo pero sin color', () => {
    // No se pueden borrar sin romper componentes; se neutralizan.
    expect(theme).toContain('.swal-neon-cyan');
    expect(theme).toMatch(/\.swal-neon-cyan,\s*\.swal-neon-orange\s*\{\s*text-shadow:\s*none/);
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   Contraste MEDIDO — el test que de verdad protege la legibilidad

   Los comentarios del CSS anotan los ratios, pero un comentario no se ejecuta:
   el dia que alguien retoque un alfa, el comentario seguira mintiendo. Aqui se
   recalcula con la formula de luminancia de WCAG 2.2 sobre los tokens REALES.
   ═══════════════════════════════════════════════════════════════════════════ */

const srgb = (c: number): number => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]: number[]): number =>
  0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const contrast = (a: number[], b: number[]): number => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// OJO con el nombre: este archivo importa `resolve` de node:path. La funcion de
// conversion se llama `hexToRgb` para no pisarlo.
const hexToRgb = (hex: string): number[] => {
  const h = hex.replace('#', '');
  // OJO: los slices arrancan en 0, no en 1. Con 1/3/5 sobre la cadena SIN '#'
  // se comia el primer digito y '#faf9f5' devolvia [175,159,5] en vez de
  // [250,249,245] — el ratio salia ~1.0 y todos los tests de contraste
  // fallaban sin que la formula tuviera nada malo.
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
/** Compone un color con alfa sobre un fondo (lo que hace el navegador). */
const over = (fg: number[], a: number, bg: number[]): number[] =>
  fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

/** Resuelve un token: '#rrggbb' o 'rgba(r, g, b, a)' sobre el canvas dado. */
function resolveToken(value: string, canvas: number[]): number[] {
  const hex = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) return hexToRgb(value);
  const rgba = value.match(/rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)/);
  if (rgba) {
    return over(
      [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])],
      Number(rgba[4]),
      canvas,
    );
  }
  throw new Error(`token no interpretable: ${value}`);
}

/** Par [nombre, tokens del tema, canvas hex] para los it.each. */
type CasoTema = [string, Record<string, string>, string];

describe('tema Bone — contraste medido (WCAG 2.2)', () => {
  it.each([
    ['claro', light, '#faf9f5'],
    ['oscuro', dark, '#121211'],
  ] satisfies CasoTema[])(
    'texto principal y secundario pasan AA en %s',
    (_nombre: string, tokens: Record<string, string>, bgHex: string) => {
      const bg = hexToRgb(bgHex);
      // AA para texto normal es 4.5:1. El principal y el secundario son los
      // que se leen sin esfuerzo, asi que no admiten excepcion.
      expect(contrast(resolveToken(tokens['--swal-text'], bg), bg)).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(resolveToken(tokens['--swal-text-secondary'], bg), bg),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each([
    ['claro', light, '#faf9f5'],
    ['oscuro', dark, '#121211'],
  ] satisfies CasoTema[])(
    'el semantico mas debil sigue siendo AA en %s',
    (_nombre: string, tokens: Record<string, string>, bgHex: string) => {
      // Un estado que no se lee es un bug funcional: el usuario no sabe si el
      // pago quedo registrado. Por eso el piso es 4.5:1 y no 3:1.
      const bg = hexToRgb(bgHex);
      for (const k of ['--swal-success', '--swal-warning', '--swal-danger', '--swal-info']) {
        const r = contrast(resolveToken(tokens[k], bg), bg);
        expect(r, `${k} en ${_nombre} da ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it.each([
    ['claro', light, '#faf9f5'],
    ['oscuro', dark, '#121211'],
  ] satisfies CasoTema[])(
    'el boton primario tiene contraste suficiente en %s',
    (_nombre: string, tokens: Record<string, string>, bgHex: string) => {
      // Texto sobre el relleno del boton: la combinacion mas critica de la app,
      // porque es donde el usuario hace clic. Se mide el token que el boton
      // USA (--swal-on-accent): antes se media --swal-accent-contrast, que
      // pasaba, mientras Button pintaba #fff y en oscuro daba 1.09:1.
      const bg = hexToRgb(bgHex);
      const acento = resolveToken(tokens['--swal-accent'], bg);
      const texto = resolveToken(tokens['--swal-on-accent'], bg);
      expect(contrast(texto, acento)).toBeGreaterThanOrEqual(4.5);
      // Y tambien en hover, que es el estado en que se pulsa.
      const hover = resolveToken(tokens['--swal-accent-hover'], bg);
      expect(contrast(texto, hover)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each([
    ['claro', light, '#faf9f5'],
    ['oscuro', dark, '#121211'],
  ] satisfies CasoTema[])(
    'el boton de peligro tiene contraste suficiente en %s',
    (_nombre: string, tokens: Record<string, string>, bgHex: string) => {
      // En oscuro el peligro es rosa claro #fb7185: con texto blanco daba
      // 2.69:1. Por eso tiene su propio primer plano.
      const bg = hexToRgb(bgHex);
      const relleno = resolveToken(tokens['--swal-danger'], bg);
      const texto = resolveToken(tokens['--swal-on-danger'], bg);
      const r = contrast(texto, relleno);
      expect(r, `on-danger en ${_nombre} da ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('accent-contrast es alias de on-accent (un solo valor que mantener)', () => {
    expect(dark['--swal-accent-contrast']).toBe('var(--swal-on-accent)');
    expect(light['--swal-accent-contrast']).toBe('var(--swal-on-accent)');
  });

  it('el texto muted alcanza AA en claro (alpha 0.65, no 0.60)', () => {
    // Con 0.60 daba 4.49:1 — a un pelo de fallar AA. Este test congela el 0.65.
    const bg = hexToRgb('#faf9f5');
    const r = contrast(resolveToken(light['--swal-text-muted'], bg), bg);
    expect(r).toBeGreaterThanOrEqual(4.5);
  });

  it('la superficie translucida no rompe el contraste del texto', () => {
    // El texto se lee sobre la TARJETA, no sobre el canvas. Con superficie
    // opaca el ratio seria otro; aqui se compone de verdad.
    const canvas = hexToRgb('#faf9f5');
    const card = resolveToken(light['--swal-surface'], canvas);
    expect(contrast(resolveToken(light['--swal-text'], card), card)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('tema Bone — piezas de la direccion visual', () => {
  it('expone la malla ambiental como token, no como clase', () => {
    // Token y no clase para que el body pueda hacer `background-image:
    // var(--swal-mesh)` y la malla correcta llegue sola segun el tema. Con
    // una clase habia que duplicar la regla para data-theme y para
    // prefers-color-scheme, y con la clase sola el body se quedaba con la
    // malla de oscuro en tema claro.
    expect(theme).toContain('--swal-mesh');
    expect(dark['--swal-mesh']).toContain('radial-gradient');
    expect(light['--swal-mesh']).toContain('radial-gradient');
    // Sin linea de grid: la malla es papel, no cuaderno cuadriculado.
    expect(theme).not.toMatch(/--swal-mesh[\s\S]{0,400}linear-gradient/);
    // Y debe existir en el bloque del sistema tambien, que es el caso real
    // cuando no hay data-theme.
    const media = theme.slice(theme.indexOf('@media (prefers-color-scheme: light)'));
    expect(media.slice(0, 4000)).toContain('--swal-mesh');
  });

  it('el glass usa el color del tema, no un azul fijo', () => {
    expect(theme).toMatch(/\.swal-glass\s*\{[^}]*background:\s*var\(--swal-surface\)/);
    expect(theme).toContain('backdrop-filter: blur(16px)');
  });

  it('define una escala de radio generosa', () => {
    // Contenedores 16-24px y botones 12px: el radio alto es lo que quita el
    // aspecto "tecnico". Un 4px u 8px plano se lee como dashboard, no editorial.
    expect(theme).toContain('--swal-radius: 12px');
    expect(theme).toContain('--swal-radius-lg: 16px');
    expect(theme).toContain('--swal-radius-xl: 24px');
  });

  it('tiene escala tipografica con pie de 11px para metadatos', () => {
    expect(theme).toContain('--swal-font-size-xs: 0.6875rem');
    expect(theme).toContain('--swal-font-mono');
  });
});

describe('paridad entre los dos temas', () => {
  // El bug que casi se escapa al portar: un token nuevo añadido solo al bloque
  // oscuro. En tema claro cae al fallback -- o no cae, si el fallback es un
  // cyan. Aqui no hay nada que "se vea bien": o existe en los dos o es un bug.
  it('todo token de tema existe en oscuro Y en claro', () => {
    const soloDark = Object.keys(dark).filter((k) => !(k in light));
    const soloLight = Object.keys(light).filter((k) => !(k in dark));
    expect({ soloDark, soloLight }).toEqual({ soloDark: [], soloLight: [] });
  });

  it('los alias de compatibilidad estan en ambos temas y apuntan a un rol', () => {
    // Nombres que el tema anterior (Edge-Hive) usaba y que los componentes del
    // core siguen pidiendo. Si uno cae, el componente compila pero se ve del
    // color equivocado, que es peor que no compilar.
    const compat = [
      '--swal-accent-cyan', '--swal-neon-cyan', '--swal-cyan-bright',
      '--swal-accent-orange', '--swal-accent-red', '--swal-neon-green',
      '--swal-bg-elevated', '--swal-bg-surface', '--swal-card-bg',
      '--swal-hover-bg', '--swal-active-bg', '--swal-danger-bg',
      '--swal-shadow-neon-cyan', '--swal-shadow-neon-orange', '--swal-shadow-neon-emerald',
      '--swal-shadow-glow-cyan', '--swal-shadow-glow-orange', '--swal-shadow-glow-emerald',
      '--swal-accent-orange-muted',
    ];
    for (const tok of compat) {
      for (const [nombre, bloque] of [['oscuro', dark], ['claro', light]] as const) {
        expect(bloque[tok], `${tok} ausente en ${nombre}`).toBeTruthy();
        expect(bloque[tok].trim(), `${tok} (${nombre}) debe ser un alias`).toMatch(/^var\(--swal-/);
      }
    }
  });

  it('ninguna sombra neon conserva un color de marca', () => {
    // "glow/neon" era luz de Edge-Hive. Bone no emite luz: si uno se cuela con
    // un rgb(), el tema deja de ser monocromatico en ese componente.
    for (const [nombre, bloque] of [['oscuro', dark], ['claro', light]] as const) {
      for (const [tok, valor] of Object.entries(bloque)) {
        if (!tok.includes('neon') && !tok.includes('glow')) continue;
        expect(valor, `${tok} (${nombre})`).not.toMatch(/rgba?\(/);
      }
    }
  });
});
