<script>
  // tabs: [{ id, label }]
  let {
    tabs = [],
    active = $bindable(''),
    children,
  } = $props();
</script>

<div class="swal-tabs" role="tablist">
  {#each tabs as tab}
    <button
      role="tab"
      aria-selected={tab.id === active}
      class="tab"
      class:active={tab.id === active}
      onclick={() => (active = tab.id)}
    >
      {tab.label}
      {#if tab.id === active}
        <span class="indicator" aria-hidden="true"></span>
      {/if}
    </button>
  {/each}
</div>

{@render children?.()}

<style>
  .swal-tabs {
    display: flex;
    border-bottom: 1px solid var(--swal-border);
    font-family: var(--swal-font);
  }
  .tab {
    position: relative;
    padding: var(--swal-space-2) var(--swal-space-4);
    font-size: var(--swal-font-size-sm);
    font-weight: 500;
    color: var(--swal-text-muted);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color var(--swal-transition-fast);
  }
  .tab:hover { color: var(--swal-text-secondary); }
  .tab.active { color: var(--swal-accent); }
  .indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--swal-accent);
  }
</style>
