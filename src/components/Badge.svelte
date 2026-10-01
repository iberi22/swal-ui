<script>
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

  .success { background: var(--swal-success-muted); color: var(--swal-success); border-color: var(--swal-success-muted); }
  .warning { background: var(--swal-warning-muted); color: var(--swal-warning); border-color: var(--swal-warning-muted); }
  .danger  { background: var(--swal-danger-muted);  color: var(--swal-danger);  border-color: var(--swal-danger-muted); }
  .info    { background: var(--swal-info-muted);    color: var(--swal-info);    border-color: var(--swal-info-muted); }
  .orange  { background: var(--swal-accent-orange-muted); color: var(--swal-accent-orange); border-color: var(--swal-accent-orange-muted); }
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
