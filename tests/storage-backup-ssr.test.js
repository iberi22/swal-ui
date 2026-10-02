import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import StorageStatus from '../src/components/StorageStatus.svelte';
import BackupPanel from '../src/components/BackupPanel.svelte';

describe('StorageStatus / BackupPanel SSR', () => {
  it('renders StorageStatus', () => {
    const { body } = render(StorageStatus, { props: {} });
    expect(body).toContain('swal-storage-status');
    expect(body).toContain('progressbar');
    expect(body).toContain('Proteger datos');
  });
  it('renders BackupPanel without dialog', () => {
    const { body } = render(BackupPanel, { props: { appId: 'a', collect: () => ({}), apply: () => {} } });
    expect(body).toContain('swal-backup-panel');
    expect(body).toContain('Exportar respaldo');
    expect(body).not.toContain('role="dialog"');
  });
});
