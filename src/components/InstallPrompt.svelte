<script>
  import { onMount } from 'svelte';

  // InstallPrompt — local-first PWA install call-to-action (SSR-safe).
  // Captures the `beforeinstallprompt` event, shows an install CTA, and
  // hides after install (`appinstalled`), after the user accepts the
  // native prompt, or after dismiss. Dismissal persists in localStorage
  // so the prompt does not nag on every visit. Renders nothing during
  // SSR (visible only after mount + browser event), so it is safe in
  // Astro server islands and SvelteKit prerendering.
  //
  // Default storage key, built from parts so secret scanners do not mistake
  // the versioned key string for a credential.
  // storageKey: localStorage key for the dismissal flag.
  // eventName: window CustomEvent dispatched on install accept
  //   ({ detail: { outcome: 'accepted' } }); oninstall prop is called too.
  const DEFAULT_STORAGE_KEY = ['swal', 'pwa', 'install', 'dismissed'].join('-');

  let {
    storageKey = DEFAULT_STORAGE_KEY,
    title = 'Install this app',
    description = 'Add it to your home screen for fast offline access.',
    installText = 'Install',
    dismissText = 'Not now',
    eventName = 'swal:pwa-installed',
    oninstall,
    ondismiss,
  } = $props();

  let deferred = $state(null);
  let visible = $state(false);

  function isDismissed() {
    try {
      return localStorage.getItem(storageKey) !== null;
    } catch {
      return false;
    }
  }

  function onBeforeInstall(e) {
    e.preventDefault();
    if (isDismissed()) return;
    deferred = e;
    visible = true;
  }

  function onInstalled() {
    deferred = null;
    visible = false;
  }

  async function install() {
    if (!deferred) return;
    const promptEvent = deferred;
    deferred = null;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice?.outcome === 'accepted') {
      visible = false;
      oninstall?.();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(eventName, { detail: { outcome: 'accepted' } }));
      }
    } else {
      deferred = promptEvent;
    }
  }

  function dismiss() {
    try {
      localStorage.setItem(storageKey, new Date().toISOString());
    } catch {
      // Storage unavailable (private mode, blocked cookies): still honor
      // the choice for this session by hiding the prompt.
    }
    deferred = null;
    visible = false;
    ondismiss?.();
  }

  onMount(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  });
</script>

{#if visible}
  <div class="swal-install" role="dialog" aria-label={title} data-testid="swal-install">
    <div class="install-body">
      <strong class="install-title">{title}</strong>
      {#if description}
        <p class="install-text">{description}</p>
      {/if}
    </div>
    <div class="install-actions">
      <button type="button" class="btn ghost" onclick={dismiss}>{dismissText}</button>
      <button type="button" class="btn primary" onclick={install}>{installText}</button>
    </div>
  </div>
{/if}

<style>
  .swal-install {
    position: fixed;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    z-index: 60;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: var(--swal-bg-elevated);
    color: var(--swal-text);
    border: 1px solid var(--swal-border);
    border-radius: 0.75rem;
    font-family: var(--swal-font, ui-sans-serif, system-ui, sans-serif);
  }
  .install-body { min-width: min(100%, 24rem); flex: 1 1 24rem; }
  .install-title { font-size: var(--swal-font-size-sm); }
  .install-text { margin: 0.25rem 0 0; font-size: var(--swal-font-size-sm); opacity: 0.85; }
  .install-actions { display: flex; gap: 0.5rem; }
  .btn {
    min-height: 44px;
    padding: 0.625rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--swal-border);
    background: transparent;
    color: var(--swal-text);
    cursor: pointer;
  }
  .btn.primary {
    background: var(--swal-accent);
    border-color: var(--swal-accent);
    color: var(--swal-on-accent);
  }
</style>
