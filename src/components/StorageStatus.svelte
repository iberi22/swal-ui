<script>
  import { onMount } from 'svelte';
  import { getStorageStatus, requestPersistence, formatBytes } from '../lib/storage.js';
  import { toast } from '../lib/toast.svelte.js';

  let {
    warnAt = 0.8,
    labels = {},
  } = $props();

  const L = $derived({
    persisted: 'Datos protegidos',
    notPersisted: 'Datos sin proteger',
    request: 'Proteger datos',
    usage: 'Uso',
    warning: 'Almacenamiento casi lleno. Exporta un respaldo y libera espacio.',
    granted: 'El navegador no borrara tus datos automaticamente.',
    denied: 'El navegador rechazo la proteccion. Exporta respaldos con frecuencia.',
    unsupported: 'Este navegador no soporta almacenamiento persistente.',
    ...labels,
  });

  let status = $state({ persisted: false, usageBytes: 0, quotaBytes: 0, ratio: 0 });
  let busy = $state(false);

  const pct = $derived(Math.round(status.ratio * 100));
  const high = $derived(status.ratio > warnAt);

  async function refresh() {
    status = await getStorageStatus();
  }

  async function request() {
    busy = true;
    try {
      const r = await requestPersistence();
      if (r === 'granted') toast.success(L.granted);
      else if (r === 'denied') toast.warning(L.denied);
      else toast.info(L.unsupported);
      await refresh();
    } finally {
      busy = false;
    }
  }

  onMount(refresh);
</script>

<div class="swal-storage-status">
  <div class="row">
    <span class="badge" class:ok={status.persisted} data-persisted={status.persisted}>
      {status.persisted ? L.persisted : L.notPersisted}
    </span>
    {#if !status.persisted}
      <button type="button" class="btn" onclick={request} disabled={busy}>{L.request}</button>
    {/if}
  </div>
  <div
    class="bar"
    class:high
    role="progressbar"
    aria-label={L.usage}
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow={pct}
  >
    <span class="fill" style="width: {pct}%"></span>
  </div>
  <p class="meta">
    {L.usage}: {formatBytes(status.usageBytes)} / {formatBytes(status.quotaBytes)} ({pct}%)
  </p>
  {#if high}
    <p class="warn" role="alert">{L.warning}</p>
  {/if}
</div>

<style>
  .swal-storage-status {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: var(--swal-font);
    font-size: var(--swal-font-size-sm);
    color: var(--swal-text);
  }
  .row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .badge {
    padding: 4px 10px;
    border-radius: var(--swal-radius-full);
    border: 1px solid color-mix(in srgb, var(--swal-warning) 30%, transparent);
    background: color-mix(in srgb, var(--swal-warning) 10%, transparent);
    color: var(--swal-warning);
    font-size: var(--swal-font-size-xs);
  }
  .badge.ok {
    border-color: color-mix(in srgb, var(--swal-success) 30%, transparent);
    background: color-mix(in srgb, var(--swal-success) 10%, transparent);
    color: var(--swal-success);
  }
  .btn {
    font: inherit;
    padding: 4px 12px;
    border-radius: var(--swal-radius-sm);
    border: 1px solid var(--swal-accent);
    background: var(--swal-accent-muted);
    color: var(--swal-accent);
    cursor: pointer;
  }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .bar {
    height: 6px;
    border-radius: var(--swal-radius-full);
    background: var(--swal-bg-surface);
    border: 1px solid var(--swal-border);
    overflow: hidden;
  }
  .fill { display: block; height: 100%; background: var(--swal-accent); }
  .bar.high .fill { background: var(--swal-danger); }
  .meta { margin: 0; color: var(--swal-text-muted, var(--swal-text)); font-size: var(--swal-font-size-xs); }
  .warn { margin: 0; color: var(--swal-danger); }
</style>
