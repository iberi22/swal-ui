import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import MagicLinkAuth from '../src/components/MagicLinkAuth.svelte';

describe('MagicLinkAuth', () => {
  beforeEach(() => {
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders default state correctly', () => {
    const { getByText, getByPlaceholderText } = render(MagicLinkAuth);

    expect(getByText('ACCESO SOBERANO SWAL')).toBeDefined();
    expect(getByText('Autenticación passwordless · Zero-knowledge')).toBeDefined();
    expect(getByPlaceholderText('Tu correo electrónico')).toBeDefined();
    expect(getByText('Ingresar')).toBeDefined();
  });

  it('handles successful submission', async () => {
    // Mock successful fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, magic_url: 'https://example.com/magic' })
    });

    // Mock window.location
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    const onSuccessMock = vi.fn();

    const { getByPlaceholderText, getByText, findByText } = render(MagicLinkAuth, {
      onSuccess: onSuccessMock
    });

    const input = getByPlaceholderText('Tu correo electrónico');
    const button = getByText('Ingresar');

    await fireEvent.input(input, { target: { value: 'test@example.com' } });
    await fireEvent.click(button);

    expect(global.fetch).toHaveBeenCalledWith('https://xaviercloud.swal.network/auth/magic-link', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' })
    }));

    const successMsg = await findByText('ENLACE MÁGICO GENERADO — REDIRIGIENDO...');
    expect(successMsg).toBeDefined();

    expect(onSuccessMock).toHaveBeenCalledWith({ ok: true, magic_url: 'https://example.com/magic' });
    expect(window.location.href).toBe('https://example.com/magic');

    // Restore window.location
    window.location = originalLocation;
  });

  it('handles error response gracefully', async () => {
    // Mock error fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: false, error: 'User not found' })
    });

    const { getByPlaceholderText, getByText, findByText } = render(MagicLinkAuth);

    const input = getByPlaceholderText('Tu correo electrónico');
    const button = getByText('Ingresar');

    await fireEvent.input(input, { target: { value: 'test@example.com' } });
    await fireEvent.click(button);

    const errorMsg = await findByText('User not found');
    expect(errorMsg).toBeDefined();
  });

  it('handles network error', async () => {
    // Mock network error
    global.fetch.mockRejectedValueOnce(new Error('Network offline'));

    const { getByPlaceholderText, getByText, findByText } = render(MagicLinkAuth);

    const input = getByPlaceholderText('Tu correo electrónico');
    const button = getByText('Ingresar');

    await fireEvent.input(input, { target: { value: 'test@example.com' } });
    await fireEvent.click(button);

    const errorMsg = await findByText('Network offline');
    expect(errorMsg).toBeDefined();
  });
});
