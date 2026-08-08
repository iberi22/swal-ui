<script>
  let {
    sidebarOpen = $bindable(true),
    brand,
    sidebarNav,
    sidebarFooter,
    headerActions,
    children,
    ...rest
  } = $props();

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="swal-dashboard" class:sidebar-collapsed={!sidebarOpen} {...rest}>
  <!-- Backdrop for mobile when sidebar is open -->
  {#if sidebarOpen}
    <button class="sidebar-backdrop" onclick={toggleSidebar} aria-label="Close sidebar"></button>
  {/if}

  <!-- Sidebar Component -->
  <aside class="swal-sidebar">
    <div class="sidebar-header">
      {#if brand}
        {@render brand()}
      {:else}
        <div class="default-brand">
          <span class="swal-neon-cyan">SWAL</span>
          <span class="brand-sub">EDGE</span>
        </div>
      {/if}
      <button class="mobile-close" onclick={toggleSidebar} aria-label="Close sidebar">
        ✕
      </button>
    </div>

    <div class="sidebar-nav-container swal-scrollbar">
      {#if sidebarNav}
        {@render sidebarNav()}
      {:else}
        <div class="placeholder-text">No navigation configured</div>
      {/if}
    </div>

    {#if sidebarFooter}
      <div class="sidebar-footer">
        {@render sidebarFooter()}
      </div>
    {/if}
  </aside>

  <!-- Main Content Area -->
  <div class="swal-main-area">
    <header class="swal-header">
      <button class="sidebar-toggle" onclick={toggleSidebar} aria-label="Toggle sidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <div class="header-actions">
        {#if headerActions}
          {@render headerActions()}
        {/if}
      </div>
    </header>

    <main class="swal-content-container swal-scrollbar">
      {@render children?.()}
    </main>
  </div>
</div>

<style>
  .swal-dashboard {
    display: flex;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--swal-bg);
    color: var(--swal-text);
    font-family: var(--swal-font);
    overflow: hidden;
    position: relative;
  }

  /* Backdrop */
  .sidebar-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: var(--swal-overlay);
    backdrop-filter: blur(4px);
    z-index: 40;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  /* Sidebar styling */
  .swal-sidebar {
    width: 260px;
    background: var(--swal-elevated);
    border-right: 1px solid var(--swal-border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: transform var(--swal-transition), margin var(--swal-transition);
    z-index: 50;
    position: relative;
  }

  .sidebar-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--swal-space-5);
    border-bottom: 1px solid var(--swal-border);
  }

  .default-brand {
    font-family: var(--swal-font-mono);
    font-weight: 700;
    font-size: var(--swal-font-size-lg);
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: var(--swal-space-2);
  }

  .brand-sub {
    color: var(--swal-accent-orange);
    font-size: 0.85em;
  }

  .mobile-close {
    display: none;
    background: transparent;
    border: none;
    color: var(--swal-text-secondary);
    font-size: var(--swal-font-size-xl);
    cursor: pointer;
    padding: var(--swal-space-1);
  }

  .sidebar-nav-container {
    flex: 1;
    overflow-y: auto;
    padding: var(--swal-space-4);
  }

  .placeholder-text {
    color: var(--swal-text-muted);
    font-size: var(--swal-font-size-xs);
    font-family: var(--swal-font-mono);
    text-align: center;
    padding: var(--swal-space-6) 0;
  }

  .sidebar-footer {
    padding: var(--swal-space-4);
    border-top: 1px solid var(--swal-border);
    background: rgba(0, 0, 0, 0.15);
  }

  /* Main Area */
  .swal-main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    height: 100vh;
    height: 100dvh;
    position: relative;
  }

  .swal-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--swal-space-5);
    border-bottom: 1px solid var(--swal-border);
    background: var(--swal-surface);
    backdrop-filter: blur(8px);
    flex-shrink: 0;
  }

  .sidebar-toggle {
    background: transparent;
    border: 1px solid var(--swal-border);
    color: var(--swal-text-secondary);
    border-radius: var(--swal-radius-sm);
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--swal-transition-fast);
  }

  .sidebar-toggle:hover {
    color: var(--swal-text);
    border-color: var(--swal-text-secondary);
    background: var(--swal-surface-hover);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--swal-space-3);
  }

  .swal-content-container {
    flex: 1;
    overflow-y: auto;
    padding: var(--swal-space-6);
  }

  /* Collapsed state */
  .sidebar-collapsed .swal-sidebar {
    margin-left: -260px;
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    .sidebar-backdrop {
      display: block;
    }

    .swal-sidebar {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      margin-left: 0 !important;
    }

    .mobile-close {
      display: block;
    }

    :global(.swal-dashboard:not(.sidebar-collapsed)) .swal-sidebar {
      transform: translateX(0);
    }
  }
</style>
