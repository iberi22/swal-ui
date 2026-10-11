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
    font-weight: 600;
    border-radius: 9999px;
    border: 1px solid transparent;
  }
  .sm { font-size: 11px; padding: 2px 8px; }
  .md { font-size: var(--swal-font-size-xs); padding: 4px 10px; }

  /* Each variant comes from its semantic token. They used to carry the
     Edge-Hive literals designed for dark only (fixed amber and cyan): on a light theme
     amber gave ~1.7:1 on paper. The "ink" is mixed 20% toward
     --swal-text, which lightens it on dark and darkens it on light: this way small
     text passes AA over its own tint on both themes. MEASURED on the
     card: light warning 5.68:1, dark warning 9.34:1, light info 6.21:1. */
  .success,
  .warning,
  .danger,
  .info {
    color: color-mix(in srgb, var(--badge-tone) 80%, var(--swal-text));
    background: color-mix(in srgb, var(--badge-tone) 10%, transparent);
    border-color: color-mix(in srgb, var(--badge-tone) 30%, transparent);
  }
  .success { --badge-tone: var(--swal-success); }
  .warning { --badge-tone: var(--swal-warning); }
  .danger  { --badge-tone: var(--swal-danger); }
  .info    { --badge-tone: var(--swal-info); }
  .orange  { background: var(--swal-accent-orange-muted); color: var(--swal-accent-orange); border-color: var(--swal-border-strong); }
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
