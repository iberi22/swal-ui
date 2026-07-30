<script>
  // Portado de edge-hive-admin/components/LoadingState.tsx
  let {
    message = 'Loading...',
    height = '16rem',
  } = $props();
</script>

<div class="swal-loading" style="min-height: {height};" role="status" aria-live="polite">
  <svg class="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
  <p>{message}</p>
</div>

<style>
  .swal-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--swal-space-10);
    width: 100%;
  }
  .spinner {
    color: var(--swal-accent);
    margin-bottom: var(--swal-space-4);
    animation: swal-spin 1s linear infinite;
  }
  p {
    font-family: var(--swal-font-mono);
    font-size: 10px;
    color: var(--swal-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    animation: swal-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes swal-spin { to { transform: rotate(360deg); } }
  @keyframes swal-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @media (prefers-reduced-motion: reduce) {
    .spinner, p { animation: none; }
  }
</style>
