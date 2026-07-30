<script>
  import { fade, scale } from 'svelte/transition';

  // Portado de edge-hive-admin/components/CommandPalette.tsx,
  // generalizado: los items los provee la app (sin vistas hardcodeadas).
  //
  // items: [{ id, label, hint?, action: () => void }]
  let {
    open = $bindable(false),
    items = [],
    placeholder = 'Type a command or search...',
    footer = 'SWAL Command',
    onclose,
  } = $props();

  let query = $state('');
  let selectedIndex = $state(0);
  let inputEl = $state(null);

  const filtered = $derived(
    items.filter((it) => it.label.toLowerCase().includes(query.toLowerCase()))
  );

  // Reset al abrir + foco al input (como el original)
  $effect(() => {
    if (open) {
      query = '';
      selectedIndex = 0;
      setTimeout(() => inputEl?.focus(), 50);
    }
  });

  $effect(() => {
    query; // reset de selección al cambiar el filtro
    selectedIndex = 0;
  });

  function close() {
    open = false;
    onclose?.();
  }

  function run(item) {
    item.action?.();
    close();
  }

  function handleKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filtered[selectedIndex];
      if (selected) run(selected);
    } else if (e.key === 'Escape') {
      close();
    }
  }
</script>

{#if open}
  <div class="swal-palette-root" transition:fade={{ duration: 150 }}>
    <button class="backdrop" onclick={close} aria-label="Cerrar" tabindex="-1"></button>

    <div class="palette" role="dialog" aria-modal="true" aria-label="Paleta de comandos" transition:scale={{ start: 0.95, duration: 200 }}>
      <div class="input-row">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          bind:this={inputEl}
          type="text"
          {placeholder}
          bind:value={query}
          onkeydown={handleKeydown}
          role="combobox"
          aria-expanded="true"
          aria-controls="swal-palette-list"
          aria-activedescendant={filtered[selectedIndex] ? `swal-palette-item-${filtered[selectedIndex].id}` : undefined}
        />
        <kbd>ESC</kbd>
      </div>

      <div class="results swal-scrollbar" id="swal-palette-list" role="listbox">
        {#if filtered.length > 0}
          <div class="group-label">Results</div>
          {#each filtered as item, index (item.id)}
            <button
              id="swal-palette-item-{item.id}"
              role="option"
              aria-selected={index === selectedIndex}
              class="item"
              class:active={index === selectedIndex}
              onclick={() => run(item)}
              onmouseenter={() => (selectedIndex = index)}
            >
              <span class="item-label">{item.label}</span>
              {#if item.hint}
                <span class="item-hint">{item.hint}</span>
              {/if}
              {#if index === selectedIndex}
                <svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              {/if}
            </button>
          {/each}
        {:else}
          <div class="empty">No results found for "{query}"</div>
        {/if}
      </div>

      <div class="footer">
        <div>
          <span>↑↓ to navigate</span>
          <span>↵ to select</span>
        </div>
        <div>{footer}</div>
      </div>
    </div>
  </div>
{/if}

<style>
  .swal-palette-root {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 20vh var(--swal-space-4) 0;
  }
  .backdrop {
    position: fixed;
    inset: 0;
    background: var(--swal-overlay);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    cursor: default;
  }
  .palette {
    position: relative;
    width: 100%;
    max-width: 36rem;
    background: var(--swal-elevated);
    border: 1px solid var(--swal-border-light);
    border-radius: var(--swal-radius-lg);
    box-shadow: var(--swal-shadow-lg);
    overflow: hidden;
    font-family: var(--swal-font);
  }
  .input-row {
    display: flex;
    align-items: center;
    padding: var(--swal-space-3) var(--swal-space-4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: var(--swal-elevated);
  }
  .search-icon {
    color: var(--swal-text-muted);
    margin-right: var(--swal-space-3);
    flex-shrink: 0;
  }
  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--swal-text);
    font-size: var(--swal-font-size-sm);
    font-weight: 500;
    height: 24px;
    font-family: var(--swal-font);
  }
  input::placeholder { color: var(--swal-text-muted); }
  kbd {
    font-family: var(--swal-font-mono);
    font-size: 10px;
    color: var(--swal-text-muted);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: var(--swal-radius-sm);
    padding: 2px 6px;
  }
  .results {
    max-height: 300px;
    overflow-y: auto;
    padding: var(--swal-space-2) 0;
  }
  .group-label {
    padding: 6px var(--swal-space-3);
    font-family: var(--swal-font-mono);
    font-size: 10px;
    color: var(--swal-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: var(--swal-space-3) var(--swal-space-4);
    font-size: var(--swal-font-size-sm);
    color: var(--swal-text-secondary);
    background: transparent;
    border: none;
    border-left: 2px solid transparent;
    cursor: pointer;
    transition: all var(--swal-transition-fast);
    font-family: var(--swal-font);
    text-align: left;
  }
  .item.active {
    background: var(--swal-accent-orange-muted);
    color: var(--swal-text);
    border-left-color: var(--swal-accent-orange);
  }
  .item-label { flex: 1; }
  .item-hint {
    font-family: var(--swal-font-mono);
    font-size: 10px;
    color: var(--swal-text-muted);
    margin-right: var(--swal-space-2);
  }
  .arrow { color: var(--swal-text-muted); }
  .empty {
    padding: var(--swal-space-8) var(--swal-space-4);
    text-align: center;
    color: var(--swal-text-muted);
    font-size: var(--swal-font-size-sm);
  }
  .footer {
    background: rgba(2, 6, 23, 0.5);
    padding: var(--swal-space-2) var(--swal-space-4);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--swal-font-mono);
    font-size: 10px;
    color: var(--swal-text-muted);
  }
  .footer span { margin-right: var(--swal-space-2); }
</style>
