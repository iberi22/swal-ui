<script>
  // Portado de edge-hive-admin/components/LoadingState.tsx
  // error: cuando se setea, muestra estado de error (icono ✗ + mensaje) en vez del spinner.
  // onretry: callback opcional que renderiza un botón "Retry" (usar junto con error).
  let {
    message = 'Loading...',
    height = '16rem',
    error = null,
    onretry = null,
  } = $props();
</script>

<div class="swal-loading" style="min-height: {height};" role="status" aria-live="polite">
  {#if error}
    <svg class="error-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
    <p class="error-text">{error}</p>
    {#if onretry}
      <button class="swal-retry" type="button" onclick={onretry}>↻ Retry</button>
    {/if}
  {:else}
    <svg class="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
    <p>{message}</p>
  {/if}
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
  .error-icon {
    color: var(--swal-danger);
    margin-bottom: var(--swal-space-4);
  }
  .error-text {
    color: var(--swal-danger);
    text-align: center;
    max-width: 90%;
    word-break: break-word;
  }
  .swal-retry {
    margin-top: var(--swal-space-4);
    font-family: var(--swal-font-mono);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--swal-accent);
    background: transparent;
    border: 1px solid var(--swal-border-light);
    border-radius: 6px;
    padding: 10px 22px;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  }
  .swal-retry:hover {
    border-color: var(--swal-accent);
    color: var(--swal-text);
    transform: translateY(-1px);
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
