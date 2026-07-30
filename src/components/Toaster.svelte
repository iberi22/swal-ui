<script>
  // Portado de edge-hive-admin/context/ToastContext.tsx
  // Requiere importar el store: se usa junto a `toast` de '@swal/ui/toast'.
  import { toasts, toast } from '../lib/toast.svelte.js';
  import { fly } from 'svelte/transition';

  const DEFAULT_DURATION = 5000;
</script>

<div class="swal-toaster" aria-live="polite">
  {#each toasts as t (t.id)}
    <div
      class="swal-toast {t.type}"
      role="alert"
      transition:fly={{ x: 100, duration: 300 }}
    >
      <button class="content" onclick={() => toast.dismiss(t.id)}>
        <span class="icon" aria-hidden="true">
          {#if t.type === 'success'}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {:else if t.type === 'error'}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {:else if t.type === 'warning'}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {:else if t.type === 'loading'}
            <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          {:else}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          {/if}
        </span>
        <span class="text">
          {#if t.title}<strong>{t.title}</strong>{/if}
          <span class="message">{t.message}</span>
        </span>
        <span class="close" aria-label="Cerrar notificación">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </span>
      </button>

      <!-- Scanline decorativa -->
      <span class="scanline" aria-hidden="true"></span>

      <!-- Barra de progreso de auto-dismiss -->
      {#if t.type !== 'loading'}
        <span class="progress-track" aria-hidden="true">
          <span
            class="progress-bar {t.type}"
            style="animation-duration: {t.duration || DEFAULT_DURATION}ms;"
          ></span>
        </span>
      {/if}
    </div>
  {/each}
</div>

<style>
  .swal-toaster {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 100;
    padding: var(--swal-space-4);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    pointer-events: none;
  }
  @media (min-width: 768px) {
    .swal-toaster { width: auto; padding: var(--swal-space-6); }
  }

  .swal-toast {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: var(--swal-radius);
    border: 1px solid;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    margin-bottom: var(--swal-space-3);
    pointer-events: auto;
    cursor: pointer;
    font-family: var(--swal-font);
  }
  @media (min-width: 768px) {
    .swal-toast { width: 24rem; }
  }

  .swal-toast.success { border-color: rgba(16, 185, 129, 0.5); box-shadow: 0 0 15px -3px rgba(16, 185, 129, 0.3); }
  .swal-toast.error   { border-color: rgba(239, 68, 68, 0.5);  box-shadow: 0 0 15px -3px rgba(239, 68, 68, 0.3); }
  .swal-toast.warning { border-color: rgba(249, 115, 22, 0.5); box-shadow: 0 0 15px -3px rgba(249, 115, 22, 0.3); }
  .swal-toast.info    { border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 0 15px -3px rgba(59, 130, 246, 0.3); }
  .swal-toast.loading { border-color: rgba(6, 182, 212, 0.5);  box-shadow: 0 0 15px -3px rgba(6, 182, 212, 0.3); }

  .content {
    display: flex;
    align-items: flex-start;
    gap: var(--swal-space-3);
    padding: var(--swal-space-4);
    width: 100%;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
  }
  .icon { flex-shrink: 0; margin-top: 2px; display: inline-flex; }
  .success .icon { color: #10b981; }
  .error .icon { color: #ef4444; }
  .warning .icon { color: var(--swal-accent-orange); }
  .info .icon { color: #3b82f6; }
  .loading .icon { color: var(--swal-accent); }
  .spin { animation: swal-spin 1s linear infinite; }

  .text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  strong {
    font-size: var(--swal-font-size-sm);
    font-weight: 700;
    color: var(--swal-text);
    margin-bottom: 2px;
  }
  .message {
    font-size: var(--swal-font-size-xs);
    color: #cbd5e1;
    font-family: var(--swal-font-mono);
    word-break: break-word;
  }
  .close {
    flex-shrink: 0;
    color: var(--swal-text-muted);
    display: inline-flex;
    transition: color var(--swal-transition-fast);
  }
  .swal-toast:hover .close { color: var(--swal-text); }

  .scanline {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
    opacity: 0.5;
    pointer-events: none;
  }

  .progress-track {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background: #1e293b;
  }
  .progress-bar {
    display: block;
    height: 100%;
    transform-origin: left;
    animation-name: swal-toast-progress;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
  .progress-bar.success { background: #10b981; }
  .progress-bar.error { background: #ef4444; }
  .progress-bar.warning { background: var(--swal-accent-orange); }
  .progress-bar.info { background: #3b82f6; }

  @keyframes swal-toast-progress {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
  }
  @keyframes swal-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    .spin { animation: none; }
    .progress-bar { animation: none; }
  }
</style>
