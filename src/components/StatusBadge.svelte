<script>
  // Portado de edge-hive-admin/components/StatusBadge.tsx
  let {
    status = 'offline', // 'healthy' | 'warning' | 'error' | 'offline'
    pulse = true,
  } = $props();
</script>

<span class="swal-status-badge" role="status" aria-label={status}>
  {#if pulse && status !== 'offline'}
    <span class="ring {status}" aria-hidden="true"></span>
  {/if}
  <span class="dot {status}" aria-hidden="true"></span>
</span>

<style>
  .swal-status-badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
  }
  .dot {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    opacity: 0.75;
    animation: swal-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  .dot.healthy { background: var(--swal-success); box-shadow: var(--swal-shadow-sm); }
  .ring.healthy { background: var(--swal-success-muted); }
  .dot.warning { background: var(--swal-warning); box-shadow: var(--swal-shadow-sm); }
  .ring.warning { background: var(--swal-warning-muted); }
  .dot.error { background: var(--swal-danger); box-shadow: var(--swal-shadow-sm); }
  .ring.error { background: var(--swal-danger-muted); }
  .dot.offline { background: var(--swal-text-muted); }
  .ring.offline { background: var(--swal-accent-muted); }

  @keyframes swal-ping {
    75%, 100% { transform: scale(2); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ring { animation: none; display: none; }
  }
</style>
