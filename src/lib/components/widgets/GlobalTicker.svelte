<script>
  // DashboardLayout|GlobalTicker|Landing
  let {
    items = [], // Array of strings or objects { text, type: 'info'|'warning'|'error'|'success'|'orange' }
    speed = 'normal', // 'slow' | 'normal' | 'fast'
    paused = false,
    interactive = true,
    onclick,
    ...rest
  } = $props();

  // Speed-to-duration mapping
  const speedMap = {
    fast: '15s',
    normal: '30s',
    slow: '60s'
  };

  let duration = $derived(speedMap[speed] || speedMap.normal);
</script>

<div
  class="swal-global-ticker-container"
  class:interactive
  class:paused
  role="status"
  {onclick}
  {...rest}
>
  <div class="ticker-content" style="--ticker-duration: {duration}">
    <!-- Render list twice to ensure seamless looping if enough elements/width -->
    <div class="ticker-track">
      {#each items as item}
        <span class="ticker-item type-{typeof item === 'object' ? item.type : 'info'}">
          <span class="ticker-bullet">●</span>
          <span class="ticker-text">{typeof item === 'object' ? item.text : item}</span>
        </span>
      {/each}
    </div>
    <div class="ticker-track" aria-hidden="true">
      {#each items as item}
        <span class="ticker-item type-{typeof item === 'object' ? item.type : 'info'}">
          <span class="ticker-bullet">●</span>
          <span class="ticker-text">{typeof item === 'object' ? item.text : item}</span>
        </span>
      {/each}
    </div>
  </div>
</div>

<style>
  .swal-global-ticker-container {
    width: 100%;
    background: var(--swal-void);
    border-bottom: 1px solid var(--swal-border);
    border-top: 1px solid var(--swal-border);
    height: 36px;
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
    user-select: none;
  }

  .interactive {
    cursor: pointer;
  }

  .ticker-content {
    display: flex;
    width: max-content;
  }

  .ticker-track {
    display: flex;
    align-items: center;
    white-space: nowrap;
    animation: swal-marquee-infinite var(--ticker-duration) linear infinite;
    padding-right: var(--swal-space-6);
  }

  .paused .ticker-track {
    animation-play-state: paused;
  }

  .interactive:hover .ticker-track {
    animation-play-state: paused;
  }

  .ticker-item {
    display: inline-flex;
    align-items: center;
    gap: var(--swal-space-2);
    margin-right: var(--swal-space-8);
    font-family: var(--swal-font-mono);
    font-size: var(--swal-font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Color-driven tokens */
  .type-info {
    color: var(--swal-text-secondary);
  }
  .type-info .ticker-bullet {
    color: var(--swal-accent);
  }

  .type-warning {
    color: var(--swal-warning);
  }
  .type-warning .ticker-bullet {
    color: var(--swal-warning);
  }

  .type-error {
    color: var(--swal-danger);
  }
  .type-error .ticker-bullet {
    color: var(--swal-danger);
  }

  .type-success {
    color: var(--swal-success);
  }
  .type-success .ticker-bullet {
    color: var(--swal-success);
  }

  .type-orange {
    color: var(--swal-accent-orange);
  }
  .type-orange .ticker-bullet {
    color: var(--swal-accent-orange);
  }

  @keyframes swal-marquee-infinite {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-100%, 0, 0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .ticker-track {
      animation: none;
      white-space: normal;
      overflow-x: auto;
    }
  }
</style>
