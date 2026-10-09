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

  /* Cada variante sale de su token semantico. Antes llevaban los literales de
     Edge-Hive pensados solo para oscuro (ambar y cian fijos): en tema claro el
     ambar daba ~1.7:1 sobre papel. La "tinta" se mezcla un 20% hacia
     --swal-text, que en oscuro la aclara y en claro la oscurece: asi el texto
     pequeno pasa AA sobre su propio tinte en los dos temas. MEDIDO sobre la
     tarjeta: aviso claro 5.68:1, aviso oscuro 9.34:1, info claro 6.21:1. */
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
