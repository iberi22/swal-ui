<script>
  let {
    variant = 'default', // 'default' | 'surface' | 'elevated' | 'glass'
    padding = 'md',      // 'none' | 'sm' | 'md' | 'lg'
    hoverable = false,
    onclick,
    children,
    ...rest
  } = $props();
</script>

{#if onclick}
  <button
    class="swal-card {variant} pad-{padding} hoverable as-button"
    {onclick}
    {...rest}
  >
    {@render children?.()}
  </button>
{:else}
  <div
    class="swal-card {variant} pad-{padding}"
    class:hoverable
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  .swal-card {
    border-radius: var(--swal-radius);
    border: 1px solid var(--swal-border);
    color: var(--swal-text);
    transition: all var(--swal-transition);
    font-family: var(--swal-font);
    text-align: left;
  }
  .as-button {
    cursor: pointer;
    width: 100%;
    font-size: inherit;
  }
  .default   { background: var(--swal-elevated); }
  .surface   { background: var(--swal-surface); }
  .elevated  { background: var(--swal-elevated); box-shadow: var(--swal-shadow); }
  .glass {
    background: var(--swal-surface);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .hoverable:hover { background: var(--swal-surface-hover); }

  .pad-none { padding: 0; }
  .pad-sm { padding: var(--swal-space-3); }
  .pad-md { padding: var(--swal-space-5); }
  .pad-lg { padding: var(--swal-space-6); }
</style>
