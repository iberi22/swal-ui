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
  .dot.healthy { background: #10b981; box-shadow: var(--swal-shadow-neon-cyan); }
  .ring.healthy { background: rgba(16, 185, 129, 0.2); }
  .dot.warning { background: var(--swal-accent-orange); box-shadow: var(--swal-shadow-neon-orange); }
  .ring.warning { background: rgba(249, 115, 22, 0.2); }
  .dot.error { background: #ef4444; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
  .ring.error { background: rgba(239, 68, 68, 0.2); }
  .dot.offline { background: #475569; }
  .ring.offline { background: rgba(71, 85, 105, 0.2); }

  @keyframes swal-ping {
    75%, 100% { transform: scale(2); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ring { animation: none; display: none; }
  }
</style>
