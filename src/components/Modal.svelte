<script>
  import { fade, scale } from 'svelte/transition';

  // Portado fielmente de edge-hive-admin/components/Modal.tsx
  let {
    open = $bindable(false),
    title = '',
    size = 'md', // 'sm' | 'md' | 'lg'
    icon,        // snippet opcional para el header
    onclose,
    children,
  } = $props();

  function close() {
    open = false;
    onclose?.();
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && open) close();
  }

  // Lock del scroll del body mientras el modal está abierto (como el original)
  $effect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div class="swal-modal-root" transition:fade={{ duration: 200 }}>
    <!-- Backdrop -->
    <button class="backdrop" onclick={close} aria-label="Cerrar modal" tabindex="-1"></button>

    <!-- Contenido -->
    <div
      class="modal {size}"
      role="dialog"
      aria-modal="true"
      aria-label={title || undefined}
      transition:scale={{ start: 0.95, duration: 200 }}
    >
      {#if title}
        <div class="header">
          <div class="header-title">
            {#if icon}
              <span class="header-icon">{@render icon()}</span>
            {/if}
            <h3>{title}</h3>
          </div>
          <button class="close-btn" onclick={close} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/if}

      <div class="body swal-scrollbar">
        {@render children?.()}
      </div>

      <!-- Gradientes decorativos (como el original) -->
      <div class="edge top" aria-hidden="true"></div>
      <div class="edge bottom" aria-hidden="true"></div>
    </div>
  </div>
{/if}

<style>
  .swal-modal-root {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--swal-space-4);
  }
  .backdrop {
    position: absolute;
    inset: 0;
    background: var(--swal-overlay);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    cursor: default;
  }
  .modal {
    position: relative;
    width: 100%;
    background: var(--swal-elevated);
    border: 1px solid var(--swal-border-light);
    border-radius: var(--swal-radius-lg);
    box-shadow: var(--swal-shadow-lg);
    overflow: hidden;
  }
  .sm { max-width: 28rem; }
  .md { max-width: 32rem; }
  .lg { max-width: 36rem; }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--swal-space-4) var(--swal-space-6);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(15, 23, 42, 0.5);
  }
  .header-title {
    display: flex;
    align-items: center;
    gap: var(--swal-space-3);
  }
  .header-icon {
    color: var(--swal-accent);
    display: inline-flex;
  }
  h3 {
    font-family: var(--swal-font);
    font-size: var(--swal-font-size-lg);
    font-weight: 700;
    color: var(--swal-text);
    letter-spacing: -0.025em;
    margin: 0;
  }
  .close-btn {
    color: var(--swal-text-muted);
    padding: 4px;
    border-radius: var(--swal-radius-sm);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all var(--swal-transition-fast);
    display: inline-flex;
  }
  .close-btn:hover {
    color: var(--swal-text);
    background: rgba(255, 255, 255, 0.05);
  }

  .body {
    padding: var(--swal-space-6);
    max-height: 80vh;
    overflow-y: auto;
    color: var(--swal-text);
    font-family: var(--swal-font);
  }

  .edge {
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
    pointer-events: none;
  }
  .edge.top { top: 0; }
  .edge.bottom { bottom: 0; }
</style>
