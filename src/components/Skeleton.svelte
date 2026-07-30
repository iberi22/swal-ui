<script>
  let {
    width = '100%',
    height = '20px',
    variant = 'text', // 'text' | 'card' | 'circle'
  } = $props();
</script>

{#if variant === 'circle'}
  <div class="swal-skeleton circle" style="width: {width}; height: {height};" aria-hidden="true"></div>
{:else if variant === 'card'}
  <div class="swal-skeleton-card" style="width: {width};" aria-hidden="true">
    <div class="swal-skeleton bar w-3-4"></div>
    <div class="swal-skeleton bar tall"></div>
    <div class="swal-skeleton bar w-1-2"></div>
  </div>
{:else}
  <div class="swal-skeleton" style="width: {width}; height: {height};" aria-hidden="true"></div>
{/if}

<style>
  .swal-skeleton {
    background: var(--swal-surface-active);
    border-radius: var(--swal-radius-sm);
    animation: swal-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .circle { border-radius: 50%; }
  .swal-skeleton-card {
    background: var(--swal-surface);
    border: 1px solid var(--swal-border);
    border-radius: var(--swal-radius);
    padding: var(--swal-space-4);
    display: flex;
    flex-direction: column;
    gap: var(--swal-space-3);
  }
  .bar { height: 16px; width: 100%; }
  .bar.tall { height: 32px; }
  .bar.w-3-4 { width: 75%; }
  .bar.w-1-2 { width: 50%; }
  @keyframes swal-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @media (prefers-reduced-motion: reduce) {
    .swal-skeleton { animation: none; }
  }
</style>
