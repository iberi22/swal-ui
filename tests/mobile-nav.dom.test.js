// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import MobileNav from '../src/components/MobileNav.svelte';
import { themeBootScript, NAV_BOOT_SCRIPT } from '../src/lib/theme-boot.js';

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

describe('MobileNav interaction', () => {
  it('toggle opens and closes, updating aria-expanded and data-nav', () => {
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

  it('Escape closes and returns focus to the toggle', () => {
    const { toggle } = setup();
    toggle.click();
    flushSync();
    document.querySelector('a.nav-item').focus();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    flushSync();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });

  it('Escape while closed does not steal focus', () => {
    const { toggle } = setup();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    flushSync();
    expect(document.activeElement).not.toBe(toggle);
  });

  it('item click calls onnavigate and closes the menu', () => {
    const onnavigate = vi.fn();
    const { toggle } = setup({ onnavigate });
    toggle.click();
    flushSync();
    document.addEventListener('click', (e) => e.preventDefault(), { once: true });
    document.querySelectorAll('a.nav-item')[1].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    flushSync();
    expect(onnavigate).toHaveBeenCalledWith(items[1]);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('adds the js class on mount as a fallback', () => {
    setup();
    expect(document.documentElement.classList.contains('js')).toBe(true);
  });
});

describe('boot scripts', () => {
  it('both add the js class to <html>', () => {
    for (const code of [NAV_BOOT_SCRIPT, themeBootScript()]) {
      document.documentElement.classList.remove('js');
      new Function(code)();
      expect(document.documentElement.classList.contains('js')).toBe(true);
    }
  });
});
