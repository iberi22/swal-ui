// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import OfflineBanner from '../src/components/OfflineBanner.svelte';
import InstallPrompt from '../src/components/InstallPrompt.svelte';

let cmp;
afterEach(() => {
  if (cmp) unmount(cmp);
  cmp = null;
  document.body.innerHTML = '';
  localStorage.clear();
});

function offline() {
  window.dispatchEvent(new Event('offline'));
  flushSync();
}

function online() {
  window.dispatchEvent(new Event('online'));
  flushSync();
}

function beforeInstall({ outcome = 'accepted' } = {}) {
  const ev = new Event('beforeinstallprompt', { cancelable: true });
  ev.prompt = vi.fn().mockResolvedValue(undefined);
  ev.userChoice = Promise.resolve({ outcome });
  const prevented = !window.dispatchEvent(ev);
  flushSync();
  return { ev, prevented };
}

describe('OfflineBanner', () => {
  it('renders nothing while online', () => {
    cmp = mount(OfflineBanner, { target: document.body, props: {} });
    flushSync();
    expect(document.querySelector('[data-testid=swal-offline]')).toBeNull();
  });

  it('shows on offline with polite live region, hides on online', () => {
    cmp = mount(OfflineBanner, { target: document.body, props: {} });
    flushSync();
    offline();
    const banner = document.querySelector('[data-testid=swal-offline]');
    expect(banner).not.toBeNull();
    const region = banner.closest('[role=status]');
    expect(region).not.toBeNull();
    expect(region.getAttribute('aria-live')).toBe('polite');
    online();
    expect(document.querySelector('[data-testid=swal-offline]')).toBeNull();
    // the live region stays mounted so the next outage is announced
    expect(document.querySelector('[role=status][aria-live=polite]')).not.toBeNull();
  });

  it('dismiss hides until the next offline event, then calls ondismiss', () => {
    const ondismiss = vi.fn();
    cmp = mount(OfflineBanner, { target: document.body, props: { ondismiss } });
    flushSync();
    offline();
    document.querySelector('.offline-dismiss').click();
    flushSync();
    expect(ondismiss).toHaveBeenCalledOnce();
    expect(document.querySelector('[data-testid=swal-offline]')).toBeNull();
    offline();
    expect(document.querySelector('[data-testid=swal-offline]')).not.toBeNull();
  });
});

describe('InstallPrompt', () => {
  it('renders nothing until beforeinstallprompt', () => {
    cmp = mount(InstallPrompt, { target: document.body, props: {} });
    flushSync();
    expect(document.querySelector('[data-testid=swal-install]')).toBeNull();
  });

  it('captures beforeinstallprompt (preventDefault) and installs on CTA', async () => {
    const oninstall = vi.fn();
    cmp = mount(InstallPrompt, { target: document.body, props: { oninstall } });
    flushSync();
    const { ev, prevented } = beforeInstall();
    expect(prevented).toBe(true);
    expect(ev.prompt).not.toHaveBeenCalled();
    const dialog = document.querySelector('[data-testid=swal-install]');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('role')).toBe('dialog');
    document.querySelector('.btn.primary').click();
    await vi.waitFor(() => expect(ev.prompt).toHaveBeenCalledOnce());
    await vi.waitFor(() => {
      flushSync();
      expect(document.querySelector('[data-testid=swal-install]')).toBeNull();
    });
    expect(oninstall).toHaveBeenCalledOnce();
  });

  it('hides on appinstalled', () => {
    cmp = mount(InstallPrompt, { target: document.body, props: {} });
    flushSync();
    beforeInstall();
    expect(document.querySelector('[data-testid=swal-install]')).not.toBeNull();
    window.dispatchEvent(new Event('appinstalled'));
    flushSync();
    expect(document.querySelector('[data-testid=swal-install]')).toBeNull();
  });

  it('dismiss persists in localStorage and stays hidden on remount', () => {
    const ondismiss = vi.fn();
    cmp = mount(InstallPrompt, { target: document.body, props: { ondismiss } });
    flushSync();
    beforeInstall();
    document.querySelector('.btn.ghost').click();
    flushSync();
    expect(ondismiss).toHaveBeenCalledOnce();
    expect(localStorage.getItem('swal-pwa-install-dismissed')).not.toBeNull();
    expect(document.querySelector('[data-testid=swal-install]')).toBeNull();
    unmount(cmp);
    cmp = mount(InstallPrompt, { target: document.body, props: {} });
    flushSync();
    beforeInstall();
    expect(document.querySelector('[data-testid=swal-install]')).toBeNull();
  });
});
