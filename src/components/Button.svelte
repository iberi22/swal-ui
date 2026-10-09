<script>
  let {
    variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger' | 'orange'
    size = 'md',         // 'sm' | 'md' | 'lg'
    disabled = false,
    loading = false,
    fullWidth = false,
    type = 'button',
    // Con href el boton se pinta como <a>. Envolver un <Button> en un <a> mete
    // un control interactivo dentro de otro: HTML invalido y dos paradas de
    // tabulador para el mismo destino.
    href = undefined,
    onclick,
    children,
    ...rest
  } = $props();
</script>

{#if href && !disabled && !loading}
  <a
    class="swal-btn {variant} {size}"
    class:full={fullWidth}
    {href}
    {onclick}
    {...rest}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    class="swal-btn {variant} {size}"
    class:full={fullWidth}
    class:busy={disabled || loading}
    {type}
    disabled={disabled || loading}
    {onclick}
    {...rest}
  >
    {#if loading}
      <span class="spinner" aria-hidden="true"></span>
    {/if}
    {@render children?.()}
  </button>
{/if}

<style>
  .swal-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: var(--swal-font);
    font-weight: 600;
    line-height: 1.2;
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
    /* Solo transform y sombra: los colores salen de tokens de tema, y una
       transicion sobre ellos se re-dispara al cambiar de tema. */
    transition: transform var(--swal-transition-fast), box-shadow var(--swal-transition-fast);
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .swal-btn:active:not(.busy) {
    transform: scale(0.98);
  }
  .swal-btn:focus-visible {
    outline: 2px solid var(--swal-accent);
    outline-offset: 3px;
  }
  .swal-btn.busy {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .swal-btn.full {
    width: 100%;
  }

  /* Variantes de relleno solido: el texto sale de --swal-on-*, nunca de un
     literal. Con `color: #fff` el primario era blanco sobre marfil en oscuro.
     `orange` es un alias legacy: --swal-accent-orange apunta al acento, asi que
     comparte primer plano con primary. */
  .primary,
  .orange {
    background: var(--swal-accent);
    color: var(--swal-on-accent);
    box-shadow: var(--swal-shadow-sm);
  }
  .orange { background: var(--swal-accent-orange); }
  .primary:hover:not(.busy),
  .orange:hover:not(.busy) {
    background: var(--swal-accent-hover);
    box-shadow: var(--swal-shadow);
  }
  /* Pulsado: el relleno se acerca al fondo. Distinto del hover sin depender
     solo del movimiento (que reduced-motion apaga). */
  .primary:active:not(.busy),
  .orange:active:not(.busy) {
    background: color-mix(in srgb, var(--swal-accent) 84%, var(--swal-bg));
    box-shadow: none;
  }

  .secondary {
    background: var(--swal-surface);
    color: var(--swal-text);
    border-color: var(--swal-border-strong);
  }
  .secondary:hover:not(.busy) {
    background: var(--swal-surface-hover);
    border-color: var(--swal-text-muted);
  }
  .secondary:active:not(.busy) { background: var(--swal-surface-active); }

  .ghost {
    background: transparent;
    color: var(--swal-text-secondary);
  }
  .ghost:hover:not(.busy) { background: var(--swal-hover); color: var(--swal-text); }
  .ghost:active:not(.busy) { background: var(--swal-surface-active); }

  .danger {
    background: var(--swal-danger);
    color: var(--swal-on-danger);
  }
  /* Hover hacia el color del texto: en claro oscurece y en oscuro aclara, y en
     los dos sube el contraste con --swal-on-danger en vez de bajarlo. */
  .danger:hover:not(.busy) { background: color-mix(in srgb, var(--swal-danger) 86%, var(--swal-text)); }
  .danger:active:not(.busy) { background: color-mix(in srgb, var(--swal-danger) 76%, var(--swal-text)); }

  /* Tamaños. md y lg cumplen el objetivo tactil de 44px; sm es para barras
     densas de escritorio, no para la accion principal de una pantalla. */
  .sm { min-height: 32px; padding: 0 12px; font-size: var(--swal-font-size-xs); border-radius: 6px; }
  .md { min-height: 44px; padding: 0 16px; font-size: var(--swal-font-size-sm); border-radius: var(--swal-radius); }
  .lg { min-height: 48px; padding: 0 24px; font-size: var(--swal-font-size); border-radius: var(--swal-radius); }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: swal-spin 0.6s linear infinite;
  }
  @keyframes swal-spin {
    to { transform: rotate(360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .swal-btn { transition: none; }
    .spinner { animation: none; border-top-color: transparent; }
    .swal-btn:active:not(.busy) { transform: none; }
  }
</style>
