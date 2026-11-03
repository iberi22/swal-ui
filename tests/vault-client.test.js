import { describe, it, expect, vi } from 'vitest';
import { deriveKey, sealPack, openPack, syncPackToCloud } from '../src/lib/vaultClient.js';
import { webcrypto } from 'crypto';

// Polyfill for tests running in Node environment
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

describe('Vault Client (XCB1)', () => {
  it('derives a key deterministically by using it to seal and open', async () => {
    const kek1 = await deriveKey('my-passphrase', 'my-salt');
    const kek2 = await deriveKey('my-passphrase', 'my-salt');

    const packId = 'pack-123';
    const plaintext = new TextEncoder().encode('secret data payload');
    const blob = await sealPack(kek1, plaintext, packId);

    // We should be able to decrypt with the second KEK derived identically
    const decrypted = await openPack(kek2, packId, blob);
    expect(new TextDecoder().decode(decrypted)).toBe('secret data payload');
  });

  it('seals and opens a pack successfully', async () => {
    const kek = await deriveKey('my-passphrase', 'my-salt');
    const packId = 'pack-123';

    const plaintext = new TextEncoder().encode('secret data payload');
    const blob = await sealPack(kek, plaintext, packId);

    // Check magic bytes XCB1 (hex 58 43 42 31)
    expect(blob[0]).toBe(0x58); // X
    expect(blob[1]).toBe(0x43); // C
    expect(blob[2]).toBe(0x42); // B
    expect(blob[3]).toBe(0x31); // 1

    const decrypted = await openPack(kek, packId, blob);
    expect(new TextDecoder().decode(decrypted)).toBe('secret data payload');
  });

  it('rejects wrong packId', async () => {
    const kek = await deriveKey('my-passphrase', 'my-salt');

    const plaintext = new TextEncoder().encode('secret data payload');
    const blob = await sealPack(kek, plaintext, 'pack-123');

    await expect(openPack(kek, 'pack-456', blob)).rejects.toThrow('Failed to decrypt pack');
  });

  it('rejects wrong kek', async () => {
    const kek1 = await deriveKey('my-passphrase', 'my-salt');
    const kek2 = await deriveKey('wrong-passphrase', 'my-salt');

    const plaintext = new TextEncoder().encode('secret data payload');
    const blob = await sealPack(kek1, plaintext, 'pack-123');

    await expect(openPack(kek2, 'pack-123', blob)).rejects.toThrow('Failed to decrypt pack');
  });

  it('rejects tampered magic bytes', async () => {
    const kek = await deriveKey('my-passphrase', 'my-salt');

    const plaintext = new TextEncoder().encode('secret data payload');
    const blob = await sealPack(kek, plaintext, 'pack-123');

    // Tamper with magic bytes
    blob[0] = 0x59; // 'Y' instead of 'X'

    await expect(openPack(kek, 'pack-123', blob)).rejects.toThrow('Invalid magic bytes');
  });

  it('syncPackToCloud sends the correct PUT request', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    const blob = new Uint8Array([1, 2, 3, 4]);
    await syncPackToCloud('https://api.example.com/chunk/hash123', blob, 'my-token');

    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/chunk/hash123', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': 'Bearer my-token'
      },
      body: blob
    });
  });

  it('syncPackToCloud throws on network error status', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    const blob = new Uint8Array([1, 2, 3, 4]);
    await expect(syncPackToCloud('https://api.example.com/chunk/hash123', blob, 'my-token')).rejects.toThrow('Cloud sync failed: 500');
  });
});
