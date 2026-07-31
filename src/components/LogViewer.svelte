<script>
  // Portado de edge-hive-admin/components/LogViewer.tsx
  //
  // lines: string[] | Array<{ level, timestamp, message }>
  // filterLevel: 'debug' | 'info' | 'warn' | 'error' — nivel mínimo visible
  // autoScroll: boolean — scroll al fondo cuando llegan logs nuevos
  // maxHeight: string — altura máxima del área de logs (CSS, ej. '300px')
  let {
    lines = [],
    filterLevel = 'debug',
    autoScroll = true,
    maxHeight = '300px',
    title = 'Real-Time Log Stream',
  } = $props();

  const LEVEL_ORDER = { debug: 0, info: 1, warn: 2, error: 3 };

  let bodyEl = $state(null);

  // Normaliza cada línea (string cruda o LogEntry) a { id, level, text, ts, isEntry }
  function normalize(line, i) {
    if (typeof line === 'string') {
      const upper = line.toUpperCase();
      let level = 'info';
      if (upper.includes('ERROR')) level = 'error';
      else if (upper.includes('WARN')) level = 'warn';
      else if (upper.includes('DEBUG')) level = 'debug';
      else if (upper.includes('INFO')) level = 'info';
      return { id: i, level, text: line, ts: '', isEntry: false };
    }
    const level = String(line?.level || 'info').toLowerCase();
    return {
      id: i,
      level,
      text: line?.message ?? '',
      ts: line?.timestamp ?? '',
      isEntry: true,
    };
  }

  const visibleLines = $derived.by(() => {
    const min = LEVEL_ORDER[filterLevel] ?? 0;
    return lines.map(normalize).filter((l) => (LEVEL_ORDER[l.level] ?? 0) >= min);
  });

  // Auto-scroll al fondo cuando llegan líneas nuevas
  $effect(() => {
    const n = visibleLines.length;
    n;
    if (autoScroll && bodyEl) {
      bodyEl.scrollTo({ top: bodyEl.scrollHeight, behavior: 'smooth' });
    }
  });

  function levelClass(level) {
    switch (level) {
      case 'error': return 'lv-error';
      case 'warn': return 'lv-warn';
      case 'info': return 'lv-info';
      case 'debug': return 'lv-debug';
      default: return '';
    }
  }
</script>

<div class="swal-logviewer">
  <h3 class="header">{title}</h3>

  <div
    class="body swal-scrollbar"
    style="max-height: {maxHeight};"
    bind:this={bodyEl}
  >
    {#if visibleLines.length === 0}
      <div class="empty">WAITING_FOR_LOGS...</div>
    {:else}
      {#each visibleLines as line (line.id)}
        <div class="line {levelClass(line.level)}">
          {#if line.isEntry}
            <span class="idx">{line.ts ? `[${line.ts}]` : `[${String(line.id).padStart(3, '0')}]`}</span>
            <span class="lvl">{line.level.toUpperCase()}</span>
          {:else}
            <span class="idx">[{String(line.id).padStart(3, '0')}]</span>
          {/if}
          <span class="msg">{line.text}</span>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .swal-logviewer {
    background: var(--swal-surface);
    border: 1px solid var(--swal-border);
    border-radius: 12px;
    padding: var(--swal-space-6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    min-width: 0;
    max-width: 100%;
  }

  .header {
    font-size: var(--swal-font-size-xs);
    font-weight: 700;
    color: var(--swal-text);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 var(--swal-space-4);
  }

  .body {
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--swal-space-4);
    background: var(--swal-void);
    border: 1px solid var(--swal-border-light);
    border-radius: var(--swal-radius);
    font-family: var(--swal-font-mono);
    font-size: 10px;
    line-height: 1.6;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  .empty {
    color: var(--swal-text-muted);
    font-style: italic;
  }

  .line {
    display: flex;
    gap: var(--swal-space-2);
    word-break: break-all;
    color: var(--swal-text-secondary);
  }

  .idx {
    opacity: 0.5;
    flex-shrink: 0;
  }

  .lvl {
    flex-shrink: 0;
    font-weight: 700;
  }

  .msg {
    min-width: 0;
  }

  /* Niveles (edge-hive: red/amber/emerald/slate) */
  .lv-error { color: var(--swal-danger); }
  .lv-warn  { color: var(--swal-warning); }
  .lv-info  { color: var(--swal-success); }
  .lv-debug { color: var(--swal-text-muted); }

  @media (max-width: 640px) {
    .swal-logviewer { padding: var(--swal-space-4); }
    .lvl { display: none; }
  }
</style>
