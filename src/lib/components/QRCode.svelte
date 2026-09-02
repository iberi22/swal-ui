<script lang="ts">
  // QRCode.svelte — @swal/ui core-first port (zero-dep, Svelte 5 runes) — H1.06
  // Props: value (url/text), size (px). Render svg placeholder grid (no deps) — WCAG alt via title
  let { value = '', size = 160, title = 'QR code', class: klass = '' } = $props<{ value?: string; size?: number; title?: string; class?: string }>();

  let bg = $derived(`var(--swal-surface)`);
</script>

<div class="qr-wrap {klass}" style="width:{size}px;height:{size}px;" role="img" aria-label={title}>
  <svg width={size} height={size} viewBox="0 0 100 100" class="qr-svg" aria-hidden="true">
    <rect x="0" y="0" width="100" height="100" rx="8" fill="white" />
    <!-- finder patterns -->
    <rect x="6" y="6" width="28" height="28" rx="4" fill="black" />
    <rect x="66" y="6" width="28" height="28" rx="4" fill="black" />
    <rect x="6" y="66" width="28" height="28" rx="4" fill="black" />
    <rect x="10" y="10" width="20" height="20" rx="3" fill="white" />
    <rect x="70" y="10" width="20" height="20" rx="3" fill="white" />
    <rect x="10" y="70" width="20" height="20" rx="3" fill="white" />
    <rect x="14" y="14" width="12" height="12" rx="2" fill="black" />
    <rect x="74" y="14" width="12" height="12" rx="2" fill="black" />
    <rect x="14" y="74" width="12" height="12" rx="2" fill="black" />
    <!-- data mock (hash of value length) -->
    {#each Array(8) as _, i}
      {#each Array(8) as __, j}
        {#if ((value.length + i * 3 + j * 7) % 3 === 0)}
          <rect x={40 + j * 6} y={40 + i * 6} width="5" height="5" rx="1" fill="black" />
        {/if}
      {/each}
    {/each}
  </svg>
  <span class="qr-value">{value}</span>
</div>

<style>
  .qr-wrap { display: grid; place-items: center; gap: 0.5rem; background: var(--swal-bg); border: 1px solid var(--swal-border); border-radius: var(--swal-radius); padding: 0.5rem; }
  .qr-svg { display: block; background: white; border-radius: 6px; }
  .qr-value { font-size: 0.7rem; color: var(--swal-text-muted); word-break: break-all; text-align: center; max-width: 100%; font-family: var(--swal-font-mono); }
  @media (prefers-reduced-motion: reduce) { .qr-wrap { animation: none; } }
</style>
