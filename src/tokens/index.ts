/**
 * SWAL Design Tokens — Identidad visual del ecosistema
 *
 * Extraídos de edge-hive/edge-hive-admin (SouthWest AI Labs identity)
 * Paleta: "Hive Dark" — fondo slate profundo + acentos naranja/cyan neon
 *
 * Uso en Tailwind:
 *   tailwind.config: presets: [require('@swal/ui/tokens/tailwind')]
 *   CSS: @import '@swal/ui/styles.css'  (define CSS variables)
 */

export const colors = {
  // ——— Fondos (Slate deep) ———
  background: {
    deepest: '#020617', // slate-950 — fondo principal / terminal
    dark: '#0f172a',    // slate-900 — paneles / sidebar
    elevated: '#151e2e', // slate-850 — cards elevadas
    raised: '#1e293b',  // slate-800 — hover / scrollbar thumb
  },
  // ——— Superficies ———
  surface: {
    card: 'rgba(2, 6, 23, 0.5)',   // card translúcida
    border: 'rgba(255, 255, 255, 0.10)',
    borderStrong: 'rgba(255, 255, 255, 0.15)',
  },
  // ——— Texto ———
  text: {
    primary: '#e2e8f0',   // slate-200 — texto principal
    secondary: '#94a3b8', // slate-400 — texto secundario
    muted: '#64748b',     // slate-500 — texto atenuado
    faint: '#334155',     // slate-700 — separadores
  },
  // ——— Acentos (Hive) ———
  accent: {
    orange: '#f97316',  // "hive.orange" — Rust / System / Acción primaria
    cyan: '#06b6d4',    // "hive.cyan" — Data / Stable / Información
    void: '#000000',    // "hive.void" — Terminal black
  },
  // ——— Estados ———
  status: {
    healthy: '#10b981', // emerald-500
    warning: '#f97316', // orange (hive)
    error: '#ef4444',   // red-500
    offline: '#475569', // slate-600
  },
  // ——— Glow / Neon ———
  glow: {
    orange: {
      soft: '0 0 15px rgba(249, 115, 22, 0.3), 0 0 30px rgba(249, 115, 22, 0.1)',
      text: '0 0 5px rgba(249, 115, 22, 0.5), 0 0 10px rgba(249, 115, 22, 0.3)',
    },
    cyan: {
      soft: '0 0 15px rgba(6, 182, 212, 0.3), 0 0 30px rgba(6, 182, 212, 0.1)',
      text: '0 0 5px rgba(6, 182, 212, 0.5), 0 0 10px rgba(6, 182, 212, 0.3)',
    },
    red: '0 0 10px rgba(239, 68, 68, 0.5)',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['"Fira Code"', 'monospace'],
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  sizes: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
} as const;

export const effects = {
  animations: {
    marquee: 'marquee 30s linear infinite',
    flicker: 'flicker 0.1s infinite alternate',
    glitch: 'glitch 0.4s cubic-bezier(.25,.46,.45,.94) both infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  // CRT scanline overlay para fondo (aplicar como body::after)
  scanlines: {
    background:
      'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
    size: '100% 4px, 3px 100%',
  },
  vignette: 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.4) 100%)',
} as const;

export const spacing = {
  '0': '0px',
  '0.5': '2px',
  '1': '4px',
  '1.5': '6px',
  '2': '8px',
  '2.5': '10px',
  '3': '12px',
  '3.5': '14px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '7': '28px',
  '8': '32px',
  '9': '36px',
  '10': '40px',
  '11': '44px',
  '12': '48px',
  '14': '56px',
  '16': '64px',
  '20': '80px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const;

export default {
  colors,
  typography,
  effects,
  spacing,
  borderRadius,
};
