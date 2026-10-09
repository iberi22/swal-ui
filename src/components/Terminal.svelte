<script>
  // Portado de edge-hive-admin/components/Terminal.tsx
  //
  // logs: [{ id, timestamp, level: 'ERROR'|'WARN'|'DEBUG'|'INFO', service, message }]
  let {
    logs = [],
    title = 'STD_OUT >> SWAL_RUNTIME',
    prompt = 'root@swal:~$',
    height = '24rem',
    autoScroll = true,
    maxHeight = null, // string | null — p. ej. '60vh'; anula `height` y deja crecer el body hasta ese tope
  } = $props();

  let bodyEl = $state(null);

  // Auto-scroll al fondo cuando llegan logs nuevos
  $effect(() => {
    if (!autoScroll) return;
    logs.length;
    bodyEl?.scrollTo({ top: bodyEl.scrollHeight, behavior: 'smooth' });
  });

  function formatTime(ts) {
    try {
      return ts.split('T')[1].split('.')[0];
    } catch {
      return ts;
    }
  }
</script>

<div class="swal-terminal">
  <div class="header">
    <div class="dots">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title">{title}</span>
    </div>
    <div class="meta">BASH - 80x24</div>
  </div>

  <div class="body swal-scrollbar" style="height: {maxHeight ? 'auto' : height}; max-height: {maxHeight || 'none'};" bind:this={bodyEl}>
    {#each logs as log (log.id)}
      <div class="line">
        <span class="ts">[{formatTime(log.timestamp)}]</span>
        <span class="level {log.level}">{log.level}</span>
        <span class="service">[{log.service}]</span>
        <span class="message">{log.message}</span>
      </div>
    {/each}

    <!-- Cursor parpadeante -->
    <div class="cursor-line">
      <span class="prompt">{prompt}</span>
      <span class="cursor"></span>
    </div>
  </div>
</div>

<style>
  .swal-terminal {
    display: flex;
    flex-direction: column;
    background: var(--swal-void);
    border: 1px solid var(--swal-border-light);
    border-radius: 6px;
    overflow: hidden;
    box-shadow: var(--swal-shadow-lg);
    font-family: var(--swal-font-mono);
    min-width: 0;
    max-width: 100%;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--swal-space-2);
    padding: var(--swal-space-2) var(--swal-space-4);
    background: var(--swal-elevated);
    border-bottom: 1px solid var(--swal-border);
  }
  .dots {
    display: flex;
    align-items: center;
    gap: var(--swal-space-2);
    min-width: 0;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .dot.red { background: var(--swal-danger-muted); border: 1px solid var(--swal-danger); }
  .dot.yellow { background: var(--swal-warning-muted); border: 1px solid var(--swal-warning); }
  .dot.green { background: var(--swal-success-muted); border: 1px solid var(--swal-success); }
  .title {
    margin-left: var(--swal-space-2);
    font-size: var(--swal-font-size-xs);
    color: var(--swal-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .meta {
    font-size: 10px;
    color: var(--swal-text-muted);
    flex-shrink: 0;
  }
  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .body {
    padding: var(--swal-space-4);
    overflow-y: auto;
    overflow-x: hidden;
    font-size: var(--swal-font-size-xs);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  @media (min-width: 768px) {
    .body { font-size: var(--swal-font-size-sm); }
  }
  .line {
    display: flex;
    gap: var(--swal-space-3);
    padding: 2px var(--swal-space-2);
    border-radius: var(--swal-radius-sm);
    transition: background var(--swal-transition-fast);
  }
  .line:hover { background: var(--swal-hover); }
  .ts { color: var(--swal-text-muted); flex-shrink: 0; width: 6rem; }
  .level { font-weight: 700; flex-shrink: 0; width: 4rem; }
  .level.ERROR { color: var(--swal-danger); }
  .level.WARN { color: var(--swal-warning); }
  .level.DEBUG { color: var(--swal-info); }
  .level.INFO { color: var(--swal-accent); }
  .service { color: var(--swal-text-muted); flex-shrink: 0; width: 6rem; }
  .message { color: var(--swal-text-secondary); word-break: break-all; min-width: 0; }

  /* Móvil: soltar anchos fijos y ocultar la columna service */
  @media (max-width: 640px) {
    .ts { width: auto; }
    .level { width: auto; }
    .service { display: none; }
  }

  .cursor-line {
    display: flex;
    align-items: center;
    gap: var(--swal-space-2);
    margin-top: var(--swal-space-2);
    padding: 0 var(--swal-space-2);
  }
  .prompt { color: var(--swal-warning); }
  .cursor {
    width: 8px;
    height: 16px;
    background: var(--swal-accent);
    animation: swal-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes swal-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cursor { animation: none; }
  }
</style>
