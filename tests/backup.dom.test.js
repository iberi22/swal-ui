// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import { createBackup, readBackupFile, restoreBackup } from '../src/lib/backup.js';
import { toasts } from '../src/lib/toast.svelte.js';
import BackupPanel from '../src/components/BackupPanel.svelte';

const file = (obj, raw) => new File([raw ?? JSON.stringify(obj)], 'b.json', { type: 'application/json' });
const mk = () => createBackup({ appId: 'app', schemaVersion: 2, collect: () => ({ notes: [{ id: 1 }, { id: 2 }], tags: [] }) });
const tick = () => new Promise((r) => setTimeout(r, 20));

describe('backup', () => {
  it('round-trips', async () => {
    const b = await mk();
    expect(b.format).toBe('swal-backup/v1');
    const parsed = await readBackupFile(file(b), { appId: 'app' });
    const apply = vi.fn();
    const res = await restoreBackup(parsed, { apply, onConflict: 'merge' });
    expect(res).toEqual({ notes: 2, tags: 0 });
    expect(apply).toHaveBeenCalledWith('notes', [{ id: 1 }, { id: 2 }], 'merge');
  });
  it('rejects invalid input', async () => {
    const b = await mk();
    await expect(readBackupFile(file(null, 'no json'))).rejects.toThrow(/JSON/);
    await expect(readBackupFile(file({ format: 'x' }))).rejects.toThrow(/formato/);
    await expect(readBackupFile(file(b), { appId: 'otra' })).rejects.toThrow(/otra app/);
    await expect(readBackupFile(file({ ...b, stores: { a: 1 } }))).rejects.toThrow(/lista/);
    await expect(readBackupFile(file(b), { maxBytes: 5 })).rejects.toThrow(/limite/);
    await expect(restoreBackup(b, { apply: () => {}, onConflict: 'x' })).rejects.toThrow(/onConflict/);
  });
});

describe('BackupPanel', () => {
  let cmp;
  afterEach(() => {
    if (cmp) unmount(cmp);
    cmp = null;
    document.body.innerHTML = '';
    toasts.length = 0;
  });

  async function pickFile(f) {
    const input = document.querySelector('input[type=file]');
    Object.defineProperty(input, 'files', { value: [f], configurable: true });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await vi.waitFor(() => {
      flushSync();
      if (!document.querySelector('[role=dialog]') && !toasts.length) throw new Error('pending');
    });
  }

  it('import shows confirmation with counts, then restores', async () => {
    const apply = vi.fn();
    const onRestored = vi.fn();
    cmp = mount(BackupPanel, { target: document.body, props: { appId: 'app', collect: () => ({}), apply, onRestored } });
    flushSync();
    expect(document.querySelector('[role=dialog]')).toBeNull();
    await pickFile(file(await mk()));
    expect(document.querySelector('[role=dialog]')).not.toBeNull();
    expect(document.querySelector('[data-store=notes]').textContent).toBe('notes: 2');
    expect(apply).not.toHaveBeenCalled();
    document.querySelector('[data-action=confirm]').click();
    await tick();
    flushSync();
    expect(apply).toHaveBeenCalledTimes(2);
    expect(onRestored).toHaveBeenCalled();
    expect(document.querySelector('[role=dialog]')).toBeNull();
    expect(toasts.some((t) => t.type === 'success')).toBe(true);
  });

  it('cancel does not apply; invalid file toasts error', async () => {
    const apply = vi.fn();
    cmp = mount(BackupPanel, { target: document.body, props: { appId: 'app', collect: () => ({}), apply } });
    flushSync();
    await pickFile(file(await mk()));
    document.querySelector('[data-action=cancel]').click();
    flushSync();
    expect(apply).not.toHaveBeenCalled();
    expect(document.querySelector('[role=dialog]')).toBeNull();
    await pickFile(file(null, 'garbage'));
    expect(toasts.some((t) => t.type === 'error')).toBe(true);
    expect(document.querySelector('[role=dialog]')).toBeNull();
  });
});
