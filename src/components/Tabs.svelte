<script>
  export let tabs = []; // [{id, label}]
  export let active = '';
</script>

<div class="flex border-b border-[var(--swal-border)]">
  {#each tabs as tab}
    <button
      class="px-4 py-2 text-sm font-medium transition-colors relative"
      class:text-[var(--swal-accent)]={tab.id === active}
      class:text-[var(--swal-text-muted)]={tab.id !== active}
      on:click={() => active = tab.id}
    >
      {tab.label}
      {#if tab.id === active}
        <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--swal-accent)]" />
      {/if}
    </button>
  {/each}
</div>

<slot />
