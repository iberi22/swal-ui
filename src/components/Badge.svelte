<script>
  // astro|island|client:visible|client:load
  let {
    variant = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'orange'
    size = 'sm',         // 'sm' | 'md'
    pulse = false,
    dot = variant !== 'neutral',
    children,
    ...rest
  } = $props();
</script>

<span
  class="swal-badge {variant} {size}"
  class:pulse
  {...rest}
>
  {#if dot}
    <span class="dot" aria-hidden="true"></span>
  {/if}
  {@render children?.()}
</span>

<style>
  .swal-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--swal-font);
    font-weight: 500;
    border-radius: 9999px;
    border: 1px solid transparent;
  }
  .sm { font-size: 11px; padding: 2px 8px; }
  .md { font-size: var(--swal-font-size-xs); padding: 4px 10px; }

  .success { background: rgba(16, 185, 129, 0.1); color: #34d399; border-color: rgba(16, 185, 129, 0.2); }
  .warning { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border-color: rgba(245, 158, 11, 0.2); }
  .danger  { background: rgba(239, 68, 68, 0.1);  color: #f87171; border-color: rgba(239, 68, 68, 0.2); }
  .info    { background: rgba(6, 182, 212, 0.1);  color: #22d3ee; border-color: rgba(6, 182, 212, 0.2); }
  .orange  { background: var(--swal-accent-orange-muted); color: var(--swal-accent-orange); border-color: rgba(249, 115, 22, 0.2); }
  .neutral { background: var(--swal-surface); color: var(--swal-text-secondary); border-color: var(--swal-border); }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
  .pulse {
    animation: swal-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes swal-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pulse { animation: none; }
  }
</style>
