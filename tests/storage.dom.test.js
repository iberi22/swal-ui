// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { requestPersistence, getStorageStatus, isQuotaError, formatBytes } from '../src/lib/storage.js';

function mockStorage(s) {
  Object.defineProperty(navigator, 'storage', { value: s, configurable: true });
}
afterEach(() => mockStorage(undefined));

describe('storage helpers', () => {
  it('requestPersistence granted/denied/unsupported', async () => {
    mockStorage({ persist: vi.fn().mockResolvedValue(true) });
    expect(await requestPersistence()).toBe('granted');
    mockStorage({ persist: vi.fn().mockResolvedValue(false) });
    expect(await requestPersistence()).toBe('denied');
    mockStorage(undefined);
    expect(await requestPersistence()).toBe('unsupported');
  });
  it('getStorageStatus computes ratio', async () => {
    mockStorage({
      persisted: async () => true,
      estimate: async () => ({ usage: 50, quota: 200 }),
    });
    expect(await getStorageStatus()).toEqual({ persisted: true, usageBytes: 50, quotaBytes: 200, ratio: 0.25 });
  });
  it('getStorageStatus without API', async () => {
    expect(await getStorageStatus()).toEqual({ persisted: false, usageBytes: 0, quotaBytes: 0, ratio: 0 });
  });
  it('isQuotaError', () => {
    expect(isQuotaError({ name: 'QuotaExceededError' })).toBe(true);
    expect(isQuotaError({ code: 22 })).toBe(true);
    expect(isQuotaError(new Error('x'))).toBe(false);
    expect(isQuotaError(null)).toBe(false);
  });
  it('formatBytes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});
