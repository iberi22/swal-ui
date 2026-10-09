// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import MobileNav from '../src/components/MobileNav.svelte';

const items = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/a', label: 'A' },
];
let cmp;
afterEach(() => {
  if (cmp) unmount(cmp);
  cmp = null;
  document.body.innerHTML = '';
  document.documentElement.classList.remove('js');
});

function setup(props = {}) {
  cmp = mount(MobileNav, { target: document.body, props: { items, ...props } });
  flushSync();
  return {
    root: document.querySelector('.swal-mobile-nav'),
    toggle: document.querySelector('.nav-toggle'),
  };
}

describe('MobileNav interaction tests', () => {
  it('abrir/cerrar con el botón', () => {
    const { root, toggle } = setup();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(root.dataset.nav).toBe('closed');
    toggle.click();
    flushSync();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(root.dataset.nav).toBe('open');
    toggle.click();
    flushSync();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(root.dataset.nav).toBe('closed');
  });

  it('cerrar con Escape y foco devuelto al botón', () => {
    const { toggle } = setup();
    toggle.click();
    flushSync();
    document.querySelector('a.nav-item').focus();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    flushSync();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });
});
