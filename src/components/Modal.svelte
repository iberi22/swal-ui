<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let open = false;
  export let title = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';

  const dispatch = createEventDispatcher();

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-xl' };

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      dispatch('close');
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') dispatch('close');
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background: var(--swal-overlay);"
    on:click={handleBackdrop}
    transition:fade={{ duration: 150 }}
  >
    <div
      class="w-full {sizes[size]} bg-[var(--swal-elevated)] border border-[var(--swal-border)] rounded-xl shadow-[var(--swal-shadow-lg)]"
      transition:scale={{ start: 0.95, duration: 200 }}
      role="dialog"
      aria-modal="true"
    >
      {#if title}
        <div class="flex items-center justify-between px-6 py-4 border-b border-[var(--swal-border)]">
          <h2 class="text-base font-semibold text-[var(--swal-text)]">{title}</h2>
          <button
            class="p-1 rounded-md text-[var(--swal-text-muted)] hover:text-[var(--swal-text)] hover:bg-[var(--swal-surface-hover)] transition-colors"
            on:click={() => dispatch('close')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/if}
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
{/if}
