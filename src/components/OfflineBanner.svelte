<script>
  import { onMount } from 'svelte';

  // OfflineBanner — local-first PWA connectivity banner (SSR-safe).
  // Visible only while the browser reports offline (`navigator.onLine`
  // is false / `offline` window event); hides on `online`. Dismissing
  // hides it for the current outage — the next `offline` event (a new
  // outage) shows it again. Renders nothing during SSR (Astro-safe).
  //
  // message: banner text. dismissLabel: accessible label of the dismiss
  //   button. ondismiss: optional callback fired when the user dismisses.
  let {
    message = 'You are offline. Changes are saved on this device and will sync when you reconnect.',
    dismissLabel = 'Dismiss offline notice',
    ondismiss,
  } = $props();

  let online = $state(true);
  let dismissed = $state(false);

  function goOffline() {
    online = false;
    dismissed = false;
  }

  function goOnline() {
    online = true;
  }

  function dismiss() {
    dismissed = true;
    ondismiss?.();
  }

  onMount(() => {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      online = navigator.onLine;
    }
    if (typeof window === 'undefined') return;
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  });
</script>

{#if !online && !dismissed}
  <div
    class="swal-offline"
    role="status"
    aria-live="polite"
    data-testid="swal-offline"
  >
    <span class="offline-dot" aria-hidden="true"></span>
    <p class="offline-text">{message}</p>
    <button type="button" class="offline-dismiss" onclick={dismiss} aria-label={dismissLabel}>
      ✕
    </button>
  </div>
{/if}

<style>
  .swal-offline {
    position: fixed;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    z-index: 60;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--swal-bg-elevated);
    color: var(--swal-text);
    border: 1px solid var(--swal-warning);
    border-radius: 0.75rem;
    font-family: var(--swal-font, ui-sans-serif, system-ui, sans-serif);
    font-size: var(--swal-font-size-sm);
  }
  .offline-dot {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--swal-warning);
  }
  .offline-text { margin: 0; flex: 1 1 auto; }
  .offline-dismiss {
    flex: none;
    min-width: 44px;
    min-height: 44px;
    border: 1px solid var(--swal-border);
    border-radius: 0.5rem;
    background: transparent;
    color: var(--swal-text);
    cursor: pointer;
  }
</style>
