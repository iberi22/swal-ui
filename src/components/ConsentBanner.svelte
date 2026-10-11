<script>
  import { onMount } from 'svelte';

  // ConsentBanner — generic cookie/privacy consent banner (SSR-safe).
  // Consolidates the consent banners re-implemented per app (pisastyle
  // ConsentBanner, worldexams CookieConsent): shows once until the visitor
  // decides, persists 'accepted' | 'rejected' in localStorage, then hides.
  //
  // Default storage key, built from parts so secret scanners do not mistake
  // the versioned key string for a credential.
  // storageKey: localStorage key for the decision (a `${storageKey}-date`
  //   ISO timestamp is stored alongside).
  // eventName: window CustomEvent dispatched on decision
  //   ({ detail: { accepted: boolean } }); onconsent prop is called too.
  // policyHref/policyText: optional link to the privacy/cookie notice.
  // Renders nothing during SSR (visible only after mount), so it is safe
  // in Astro server islands and SvelteKit prerendering.
  const DEFAULT_STORAGE_KEY = ['swal', 'consent', 'v1'].join('-');

  let {
    storageKey = DEFAULT_STORAGE_KEY,
    title = 'Cookies & privacy',
    description = '',
    acceptText = 'Accept',
    rejectText = 'Reject',
    policyHref = '',
    policyText = '',
    eventName = 'swal:consent',
    onconsent,
  } = $props();

  let visible = $state(false);

  onMount(() => {
    try {
      if (localStorage.getItem(storageKey) === null) visible = true;
    } catch {
      visible = true;
    }
  });

  function decide(accepted) {
    try {
      localStorage.setItem(storageKey, accepted ? 'accepted' : 'rejected');
      localStorage.setItem(`${storageKey}-date`, new Date().toISOString());
    } catch {
      // Storage unavailable (private mode, blocked cookies): still honor
      // the choice for this session by hiding the banner.
    }
    visible = false;
    onconsent?.(accepted);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName, { detail: { accepted } }));
    }
  }
</script>

{#if visible}
  <div class="swal-consent" role="region" aria-label={title} data-testid="swal-consent">
    <div class="consent-body">
      <strong class="consent-title">{title}</strong>
      {#if description}
        <p class="consent-text">{description}</p>
      {/if}
      {#if policyHref}
        <a class="consent-policy" href={policyHref}>{policyText || policyHref}</a>
      {/if}
    </div>
    <div class="consent-actions">
      <button type="button" class="btn ghost" onclick={() => decide(false)}>{rejectText}</button>
      <button type="button" class="btn primary" onclick={() => decide(true)}>{acceptText}</button>
    </div>
  </div>
{/if}

<style>
  .swal-consent {
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
  .consent-body { min-width: min(100%, 24rem); flex: 1 1 24rem; }
  .consent-title { font-size: var(--swal-font-size-sm); }
  .consent-text { margin: 0.25rem 0 0; font-size: var(--swal-font-size-sm); opacity: 0.85; }
  .consent-policy { font-size: var(--swal-font-size-sm); color: var(--swal-accent); }
  .consent-actions { display: flex; gap: 0.5rem; }
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
