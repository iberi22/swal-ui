<script>
  import {
    Button, Card, Badge, Modal, Table, Tabs, Input, Skeleton,
    StatusBadge, LoadingState, Terminal, CommandPalette, Toaster,
  } from '../src/components/index.js';
  import { toast } from '../src/lib/toast.svelte.js';

  let showModal = $state(false);
  let paletteOpen = $state(false);
  let activeTab = $state('overview');
  let email = $state('');
  let emailError = $state('Formato de email inválido');

  const tabItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'trades', label: 'Trades' },
    { id: 'risk', label: 'Risk' },
  ];

  const columns = [
    { key: 'node', label: 'Nodo' },
    { key: 'region', label: 'Región' },
    { key: 'latency', label: 'Latencia' },
    { key: 'status', label: 'Estado' },
  ];
  const rows = [
    { node: 'SGP-03', region: 'Singapur', latency: '12ms', status: 'healthy' },
    { node: 'HN-05', region: 'Helsinki', latency: '89ms', status: 'warning' },
    { node: 'DFW-01', region: 'Dallas', latency: '—', status: 'offline' },
  ];

  const logs = [
    { id: 1, timestamp: '2026-07-30T21:00:01.204Z', level: 'INFO', service: 'mesh', message: 'peer HN-05 autenticado via WireGuard' },
    { id: 2, timestamp: '2026-07-30T21:00:03.551Z', level: 'WARN', service: 'chaos', message: 'AI predicted 12.5% failure chance in Node:SGP-03' },
    { id: 3, timestamp: '2026-07-30T21:00:04.002Z', level: 'ERROR', service: 'ledger', message: 'block 0x4f22ae verification timeout — retrying' },
    { id: 4, timestamp: '2026-07-30T21:00:05.918Z', level: 'DEBUG', service: 'cache', message: 'hive-mind cache invalidated (ttl=300s)' },
  ];

  const paletteItems = [
    { id: 'dash', label: 'Go to Dashboard', hint: 'G D', action: () => toast.info('Navegando a Dashboard') },
    { id: 'deploy', label: 'Deploy Active Function', hint: '⌘D', action: () => toast.loading('Desplegando función…') },
    { id: 'backup', label: 'Trigger Manual Backup', action: () => toast.success('Backup iniciado', 'Ledger') },
    { id: 'chaos', label: 'Open Chaos Lab', action: () => toast.warning('Chaos Lab en modo seguro') },
  ];
</script>

<svelte:window onkeydown={(e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); paletteOpen = !paletteOpen; }
}} />

<div class="page swal-grid-bg">
  <header class="topbar">
    <h1>@swal/ui <span class="swal-accent">v0.2</span> — Ensayo de afinación</h1>
    <div class="topbar-actions">
      <Button variant="ghost" size="sm" onclick={() => (paletteOpen = true)}>⌘K Palette</Button>
      <Button variant="orange" size="sm" onclick={() => (showModal = true)}>Abrir Modal</Button>
    </div>
  </header>

  <!-- Fila 1: Botones + Badges + Status -->
  <section class="row">
    <Card variant="elevated">
      <h2>Button</h2>
      <div class="stack">
        <div class="cluster">
          <Button variant="primary">Primary</Button>
          <Button variant="orange">Orange</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div class="cluster">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button loading={true}>Loading</Button>
          <Button disabled={true}>Disabled</Button>
        </div>
        <Button fullWidth={true} variant="secondary">Full width</Button>
      </div>
    </Card>

    <Card variant="elevated">
      <h2>Badge + StatusBadge</h2>
      <div class="stack">
        <div class="cluster">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger" pulse={true}>Live</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="orange">System</Badge>
          <Badge variant="neutral" size="md">Neutral</Badge>
        </div>
        <div class="cluster status-row">
          <span><StatusBadge status="healthy" /> healthy</span>
          <span><StatusBadge status="warning" /> warning</span>
          <span><StatusBadge status="error" /> error</span>
          <span><StatusBadge status="offline" /> offline</span>
        </div>
      </div>
    </Card>
  </section>

  <!-- Fila 2: Toasts + Tabs + Input -->
  <section class="row">
    <Card variant="surface">
      <h2>Toast</h2>
      <div class="cluster">
        <Button size="sm" variant="secondary" onclick={() => toast.success('Bloque 0x4f22ae verificado', 'Ledger')}>Success</Button>
        <Button size="sm" variant="secondary" onclick={() => toast.error('Timeout alcanzado en SGP-03', 'Mesh')}>Error</Button>
        <Button size="sm" variant="secondary" onclick={() => toast.warning('Disco al 90% en HN-05')}>Warning</Button>
        <Button size="sm" variant="secondary" onclick={() => toast.info('Sincronización federada completa')}>Info</Button>
        <Button size="sm" variant="secondary" onclick={() => { const id = toast.loading('Desplegando en edge…'); setTimeout(() => toast.dismiss(id), 3000); }}>Loading 3s</Button>
      </div>
    </Card>

    <Card variant="surface">
      <h2>Tabs + Input</h2>
      <Tabs tabs={tabItems} bind:active={activeTab} />
      <div class="tab-content">
        {#if activeTab === 'overview'}
          <Input bind:value={email} label="Email" type="email" placeholder="ops@swal.dev" />
        {:else if activeTab === 'trades'}
          <Input label="Con error" value="no-es-un-email" error={emailError} />
        {:else}
          <Input label="Búsqueda" placeholder="Filtrar nodos…" />
        {/if}
      </div>
    </Card>
  </section>

  <!-- Fila 3: Table + Skeleton + Loading -->
  <section class="row">
    <Card variant="default" padding="none">
      <h2 class="pad-title">Table</h2>
      <Table {columns} {rows} />
    </Card>

    <Card variant="default">
      <h2>Skeleton + LoadingState</h2>
      <div class="row-inner">
        <div class="stack grow">
          <Skeleton width="60%" height="14px" />
          <Skeleton variant="card" />
          <div class="cluster">
            <Skeleton variant="circle" width="40px" height="40px" />
            <Skeleton width="120px" height="40px" />
          </div>
        </div>
        <LoadingState message="Syncing Hive Mind…" height="12rem" />
      </div>
    </Card>
  </section>

  <!-- Fila 4: Terminal full-width + utilidades -->
  <section class="row single">
    <Terminal {logs} title="STD_OUT >> EDGE_HIVE_RUNTIME" height="14rem" />
  </section>

  <section class="row single">
    <Card variant="glass">
      <h2>Utilidades <span class="swal-neon-cyan">neon</span></h2>
      <p class="swal-text-secondary">
        Card <code>glass</code> con <span class="swal-neon-orange">texto neon orange</span> y
        <span class="swal-neon-cyan">texto neon cyan</span> sobre <code>.swal-grid-bg</code>.
      </p>
      <div class="ticker-wrap">
        <div class="swal-marquee ticker">
          <span class="swal-accent">●</span> CHAOS: AI predicted 12.5% failure chance in Node:SGP-03 &nbsp;|&nbsp;
          <span class="swal-accent">●</span> LEDGER: Verified block 0x4f22ae using NIST Kyber-1024 &nbsp;|&nbsp;
        </div>
      </div>
    </Card>
  </section>

  <Modal bind:open={showModal} title="Deploy a producción" size="sm">
    {#snippet icon()}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
    {/snippet}
    <p class="modal-text">Vas a desplegar <code>hive-core v2.4.1</code> en 3 nodos edge. Esta acción invalida la caché global.</p>
    <div class="cluster modal-actions">
      <Button variant="secondary" onclick={() => (showModal = false)}>Cancelar</Button>
      <Button variant="orange" onclick={() => { showModal = false; toast.success('Deploy iniciado en 3 nodos', 'Edge'); }}>Confirmar deploy</Button>
    </div>
  </Modal>

  <CommandPalette bind:open={paletteOpen} items={paletteItems} footer="Edge Hive Command" />
  <Toaster />
</div>

<style>
  :global(body) {
    margin: 0;
    background: var(--swal-bg);
    color: var(--swal-text);
    font-family: var(--swal-font);
    -webkit-font-smoothing: antialiased;
  }
  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--swal-space-6);
    display: flex;
    flex-direction: column;
    gap: var(--swal-space-5);
    min-height: 100vh;
    min-height: 100dvh;
  }
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--swal-space-3);
  }
  h1 {
    font-size: var(--swal-font-size-xl);
    font-weight: 700;
    letter-spacing: -0.025em;
    margin: 0;
  }
  h2 {
    font-size: var(--swal-font-size-sm);
    font-weight: 600;
    color: var(--swal-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 var(--swal-space-4);
  }
  .pad-title { padding: var(--swal-space-5) var(--swal-space-5) 0; }
  .topbar-actions { display: flex; gap: var(--swal-space-2); }
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--swal-space-5);
  }
  .row.single { grid-template-columns: 1fr; }
  .row > :global(*) { min-width: 0; }
  @media (max-width: 768px) {
    .row { grid-template-columns: 1fr; }
  }
  .stack { display: flex; flex-direction: column; gap: var(--swal-space-3); }
  .cluster { display: flex; flex-wrap: wrap; gap: var(--swal-space-2); align-items: center; }
  .status-row span {
    display: inline-flex;
    align-items: center;
    gap: var(--swal-space-2);
    font-family: var(--swal-font-mono);
    font-size: var(--swal-font-size-xs);
    color: var(--swal-text-secondary);
  }
  .tab-content { padding-top: var(--swal-space-4); }
  .row-inner { display: flex; gap: var(--swal-space-4); align-items: flex-start; }
  .grow { flex: 1; }
  .modal-text { color: var(--swal-text-secondary); font-size: var(--swal-font-size-sm); margin: 0 0 var(--swal-space-4); }
  .modal-actions { justify-content: flex-end; }
  code {
    font-family: var(--swal-font-mono);
    font-size: 0.85em;
    background: var(--swal-surface-active);
    padding: 1px 5px;
    border-radius: var(--swal-radius-sm);
  }
  .ticker-wrap {
    overflow: hidden;
    white-space: nowrap;
    border-top: 1px solid var(--swal-border);
    margin-top: var(--swal-space-4);
    padding-top: var(--swal-space-3);
  }
  .ticker {
    display: inline-block;
    font-family: var(--swal-font-mono);
    font-size: 10px;
    color: var(--swal-text-muted);
    text-transform: uppercase;
  }
</style>
