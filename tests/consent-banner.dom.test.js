// @vitest-environment jsdom
import fs from 'node:fs';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import ConsentBanner from '../src/components/ConsentBanner.svelte';

let cmp;
afterEach(() => {
  if (cmp) unmount(cmp);
  cmp = null;
  document.body.innerHTML = '';
  localStorage.clear();
});

function setup(props = {}) {
  cmp = mount(ConsentBanner, {
    target: document.body,
    props: {
      title: 'Cookies & privacy',
      description: 'We use local storage only.',
      acceptText: 'Accept',
      rejectText: 'Reject',
      ...props,
    },
  });
  flushSync();
  return document.querySelector('[data-testid="swal-consent"]');
}

describe('ConsentBanner', () => {
  it('shows when no decision is stored', () => {
    const banner = setup();
    expect(banner).not.toBeNull();
    expect(banner.getAttribute('role')).toBe('region');
    expect(banner.getAttribute('aria-label')).toBe('Cookies & privacy');
  });

  it('stays hidden when a decision is already stored', () => {
    localStorage.setItem('swal-consent-v1', 'accepted');
    expect(setup()).toBeNull();
  });

  it('accept persists, hides and dispatches the event', () => {
    const onConsent = vi.fn();
    const seen = [];
    const listener = (e) => seen.push(e.detail);
    window.addEventListener('swal:consent', listener);
    const banner = setup({ storageKey: 'test-consent', onconsent: onConsent });
    banner.querySelector('.btn.primary').click();
    flushSync();
    expect(localStorage.getItem('test-consent')).toBe('accepted');
    expect(localStorage.getItem('test-consent-date')).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(document.querySelector('[data-testid="swal-consent"]')).toBeNull();
    expect(onConsent).toHaveBeenCalledWith(true);
    expect(seen).toEqual([{ accepted: true }]);
    window.removeEventListener('swal:consent', listener);
  });

  it('reject persists "rejected" and hides', () => {
    const banner = setup({ storageKey: 'test-consent' });
    banner.querySelector('.btn.ghost').click();
    flushSync();
    expect(localStorage.getItem('test-consent')).toBe('rejected');
    expect(document.querySelector('[data-testid="swal-consent"]')).toBeNull();
  });

  it('touch targets meet the 44px minimum', () => {
    const src = fs.readFileSync('src/components/ConsentBanner.svelte', 'utf8');
    const css = src.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
    expect(css).toMatch(/\.btn\s*\{[^}]*min-height:\s*44px/);
  });
});
