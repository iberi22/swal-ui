import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Modal from '../src/components/Modal.svelte';
import MobileNav from '../src/components/MobileNav.svelte';
import CommandPalette from '../src/components/CommandPalette.svelte';
import ConsentBanner from '../src/components/ConsentBanner.svelte';

// Locks the SSR-safety audit: importing and server-rendering these
// components must not touch window/document/localStorage at module scope
// or during render (all browser access lives in onMount/$effect/handlers).
describe('SSR safety: Modal / MobileNav / CommandPalette / ConsentBanner', () => {
  it('renders Modal closed without dialog markup', () => {
    const { body } = render(Modal, { props: { open: false, title: 'Settings' } });
    expect(body).not.toContain('role="dialog"');
  });

  it('renders Modal open with dialog role and focusable container', () => {
    const { body } = render(Modal, { props: { open: true, title: 'Settings' } });
    expect(body).toContain('role="dialog"');
    expect(body).toContain('aria-modal="true"');
    expect(body).toContain('tabindex="-1"');
  });

  it('renders MobileNav without touching the DOM', () => {
    const { body } = render(MobileNav, {
      props: { items: [{ href: '/', label: 'Home' }], currentPath: '/' },
    });
    expect(body).toContain('swal-mobile-nav');
    expect(body).toContain('aria-expanded');
  });

  it('renders CommandPalette open with combobox wiring', () => {
    const { body } = render(CommandPalette, {
      props: { open: true, items: [{ id: 'a', label: 'Alpha', action: () => {} }] },
    });
    expect(body).toContain('role="combobox"');
    expect(body).toContain('aria-controls="swal-palette-list"');
  });

  it('renders ConsentBanner empty on the server (decision needs the browser)', () => {
    const { body } = render(ConsentBanner, { props: {} });
    expect(body).not.toContain('swal-consent');
  });
});
