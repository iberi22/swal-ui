// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { themeBootScript, THEME_STORAGE_KEY } from '../src/lib/theme-boot.js';
import { themeModeScript, THEME_MODE_KEY } from '../src/lib/themeMode.js';

describe('Estado actual de los dos mecanismos de tema', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-mode');
    document.documentElement.style.colorScheme = '';
  });

  afterEach(() => {
    delete window.swalTheme;
  });

  it('theme-boot.js lee "swal-theme" y aplica el valor directamente a data-theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    // Ejecutar el script inline
    new Function(themeBootScript())();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('themeMode.js lee "swal:theme-mode" y mapea a data-theme (ej. taller-dark)', () => {
    localStorage.setItem(THEME_MODE_KEY, 'dark');
    // Ejecutar el script inline
    new Function(themeModeScript())();
    expect(document.documentElement.getAttribute('data-theme')).toBe('taller-dark');
    expect(document.documentElement.getAttribute('data-theme-mode')).toBe('dark');
  });

  it('themeMode.js lee "swal:theme-mode" y mapea a data-theme (ej. taller)', () => {
    localStorage.setItem(THEME_MODE_KEY, 'light');
    // Ejecutar el script inline
    new Function(themeModeScript())();
    expect(document.documentElement.getAttribute('data-theme')).toBe('taller');
    expect(document.documentElement.getAttribute('data-theme-mode')).toBe('light');
  });
});
