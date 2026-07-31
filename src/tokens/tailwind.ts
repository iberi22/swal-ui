/**
 * SWAL Tailwind Preset — para apps que usan Tailwind vía config
 *
 * Uso:
 *   tailwind.config.js
 *   module.exports = {
 *     presets: [require('@swal/ui/tokens/tailwind')],
 *     content: [...]
 *   }
 */
import type { Config } from 'tailwindcss';

const swalPreset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          950: '#020617',
        },
        hive: {
          orange: '#f97316',
          cyan: '#06b6d4',
          void: '#000000',
        },
        surface: {
          card: 'rgba(2, 6, 23, 0.5)',
          border: 'rgba(255, 255, 255, 0.10)',
          borderStrong: 'rgba(255, 255, 255, 0.15)',
        },
      },
      boxShadow: {
        'neon-orange': '0 0 15px rgba(249, 115, 22, 0.3), 0 0 30px rgba(249, 115, 22, 0.1)',
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.3), 0 0 30px rgba(6, 182, 212, 0.1)',
        'neon-red': '0 0 10px rgba(239, 68, 68, 0.5)',
      },
      textShadow: {
        'neon-orange': '0 0 5px rgba(249, 115, 22, 0.5), 0 0 10px rgba(249, 115, 22, 0.3)',
        'neon-cyan': '0 0 5px rgba(6, 182, 212, 0.5), 0 0 10px rgba(6, 182, 212, 0.3)',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        flicker: 'flicker 0.1s infinite alternate',
        glitch: 'glitch 0.4s cubic-bezier(.25,.46,.45,.94) both infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        flicker: {
          '0%': { opacity: '0.97' },
          '100%': { opacity: '1.0' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
};

export default swalPreset;
