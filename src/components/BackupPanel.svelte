<script>
  import { createBackup, downloadBackup, readBackupFile, restoreBackup, countStores } from '../lib/backup.js';
  import { toast } from '../lib/toast.svelte.js';

  /**
   * Props (callbacks de la app):
   *  - appId, schemaVersion
   *  - collect(): Promise<{ [store]: any[] }>
   *  - apply(name, records, mode): Promise<void>
   *  - onRestored?(result)
   */
  let {
    appId,
    schemaVersion = 1,
    collect,
    apply,
    onConflict = 'replace',
    maxBytes,
    filename,
    onRestored,
    labels = {},
  } = $props();

  const L = $derived({
    title: 'Respaldo de datos',
    export: 'Exportar respaldo',
    import: 'Importar respaldo',
    drop: 'o arrastra aqui un archivo de respaldo (.json)',
    confirmTitle: 'Restaurar respaldo',
    confirmText: 'Se restauraran estos datos. Esta accion puede reemplazar los datos actuales.',
    confirm: 'Restaurar',
    cancel: 'Cancelar',
    exported: 'Respaldo exportado',
    restored: 'Datos restaurados',
    ...labels,
  });

  let pending = $state(null);
  let busy = $state(false);
  let dragging = $state(false);
  /** @type {HTMLInputElement | undefined} */
  let input = $state();

  const counts = $derived(pending ? Object.entries(countStores(pending)) : []);

  async function doExport() {
    busy = true;
    try {
      const b = await createBackup({ appId, schemaVersion, collect });
      const name = downloadBackup(b, filename);
      toast.success(`${L.exported}: ${name}`);
    } catch (e) {
      toast.error(e?.message || String(e));
    } finally {
      busy = false;
    }
  }

  async function pick(file) {
    if (!file) return;
    try {
      pending = await readBackupFile(file, { appId, maxBytes });
    } catch (e) {
      pending = null;
      toast.error(e?.message || String(e));
    }
  }

  function onChange(e) {
    const f = e.currentTarget.files?.[0];
    pick(f);
    e.currentTarget.value = '';
  }

  function onDrop(e) {
    e.preventDefault();
    dragging = false;
    pick(e.dataTransfer?.files?.[0]);
  }

  async function doRestore() {
    const b = pending;
    busy = true;
    try {
      const result = await restoreBackup(b, { apply, onConflict });
      pending = null;
      toast.success(L.restored);
      onRestored?.(result);
    } catch (e) {
      toast.error(e?.message || String(e));
    } finally {
      busy = false;
    }
  }
</script>

<div class="swal-backup-panel">
  <h3>{L.title}</h3>
  <div class="actions">
    <button type="button" class="btn primary" data-action="export" onclick={doExport} disabled={busy}>{L.export}</button>
    <button type="button" class="btn" data-action="import" onclick={() => input?.click()} disabled={busy}>{L.import}</button>
    <input
      bind:this={input}
      class="file"
      type="file"
      accept="application/json,.json"
      aria-label={L.import}
      onchange={onChange}
    />
  </div>
  <div
    class="drop"
    class:dragging
    role="group"
    aria-label={L.drop}
    ondragover={(e) => { e.preventDefault(); dragging = true; }}
    ondragleave={() => (dragging = false)}
    ondrop={onDrop}
  >{L.drop}</div>

  {#if pending}
    <div class="overlay">
      <div class="dialog" role="dialog" aria-modal="true" aria-label={L.confirmTitle}>
        <h4>{L.confirmTitle}</h4>
        <p>{L.confirmText}</p>
        <ul>
          {#each counts as [name, n] (name)}
            <li data-store={name}>{name}: {n}</li>
          {/each}
        </ul>
        <div class="actions">
          <button type="button" class="btn" data-action="cancel" onclick={() => (pending = null)} disabled={busy}>{L.cancel}</button>
          <button type="button" class="btn primary" data-action="confirm" onclick={doRestore} disabled={busy}>{L.confirm}</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .swal-backup-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-family: var(--swal-font);
    font-size: var(--swal-font-size-sm);
    color: var(--swal-text);
  }
  h3, h4 { margin: 0; }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .file { display: none; }
  .btn {
    font: inherit;
    padding: 6px 14px;
    border-radius: var(--swal-radius-sm);
    border: 1px solid var(--swal-border-strong, var(--swal-border));
    background: var(--swal-bg-surface);
    color: var(--swal-text);
    cursor: pointer;
  }
  .btn.primary {
    border-color: var(--swal-accent);
    background: var(--swal-accent);
    color: var(--swal-on-accent, var(--swal-accent-contrast));
  }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .drop {
    padding: 18px;
    text-align: center;
    border: 1px dashed var(--swal-border-strong, var(--swal-border));
    border-radius: var(--swal-radius);
    color: var(--swal-text-muted, var(--swal-text));
  }
  .drop.dragging { border-color: var(--swal-accent); background: var(--swal-accent-muted); }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    background: var(--swal-overlay, rgba(0, 0, 0, 0.6));
  }
  .dialog {
    min-width: min(360px, 90vw);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--swal-bg-elevated);
    border: 1px solid var(--swal-border);
    border-radius: var(--swal-radius-lg);
    box-shadow: var(--swal-shadow-lg);
  }
  .dialog p { margin: 0; }
  .dialog ul { margin: 0; padding-left: 18px; font-family: var(--swal-font-mono); }
  .dialog .actions { justify-content: flex-end; }
</style>
