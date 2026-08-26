<script>
  import { getContext } from 'svelte';

  let {
    status: statusProp = undefined,
    fallback,
    children,
  } = $props();

  const ctx = getContext('swal:node');

  let resolvedStatus = $derived(
    statusProp !== undefined ? statusProp : ctx?.status ?? 'inactive'
  );

  let isActive = $derived(resolvedStatus === 'active');
</script>

{#if isActive}
  {@render children?.()}
{:else if fallback}
  {@render fallback()}
{/if}

<style>
  :global(.swal-pro-gate-fallback) {
    color: var(--swal-text-muted);
    font-family: var(--swal-font);
    font-size: var(--swal-font-size-sm);
  }
</style>
