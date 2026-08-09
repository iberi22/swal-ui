<script>
  // astro|island|client:visible|client:load
  let {
    variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger' | 'orange'
    size = 'md',         // 'sm' | 'md' | 'lg'
    disabled = false,
    loading = false,
    fullWidth = false,
    type = 'button',
    onclick,
    children,
    ...rest
  } = $props();
</script>

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

<style>
  .swal-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: var(--swal-font);
    font-weight: 500;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all var(--swal-transition-fast);
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .swal-btn:active:not(.busy) {
    transform: scale(0.98);
  }
  .swal-btn.busy {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .swal-btn.full {
    width: 100%;
  }

  /* Variantes */
  .primary {
    background: var(--swal-accent);
    color: #fff;
    box-shadow: var(--swal-shadow-sm);
  }
  .primary:hover:not(.busy) { background: var(--swal-accent-hover); }

  .orange {
    background: var(--swal-accent-orange);
    color: #fff;
    box-shadow: var(--swal-shadow-sm);
  }
  .orange:hover:not(.busy) { opacity: 0.9; }

  .secondary {
    background: var(--swal-surface);
    color: var(--swal-text);
    border-color: var(--swal-border);
  }
  .secondary:hover:not(.busy) { background: var(--swal-surface-hover); }

  .ghost {
    background: transparent;
    color: var(--swal-text-secondary);
  }
  .ghost:hover:not(.busy) { background: var(--swal-surface-hover); }

  .danger {
    background: var(--swal-danger);
    color: #fff;
  }
  .danger:hover:not(.busy) { opacity: 0.9; }

  /* Tamaños */
  .sm { height: 32px; padding: 0 12px; font-size: var(--swal-font-size-xs); border-radius: 6px; }
  .md { height: 40px; padding: 0 16px; font-size: var(--swal-font-size-sm); border-radius: var(--swal-radius); }
  .lg { height: 48px; padding: 0 24px; font-size: var(--swal-font-size); border-radius: var(--swal-radius); }

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
    .spinner { animation: none; border-top-color: transparent; }
    .swal-btn:active:not(.busy) { transform: none; }
  }
</style>
