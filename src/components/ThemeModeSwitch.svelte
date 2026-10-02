<script>
  /**
   * ThemeModeSwitch — Selector de tema Claro / Oscuro / Sistema.
   * Lee el modo con getThemeMode() y lo cambia con setThemeMode() (window.swalTheme.set, que
   * guarda y re-aplica el tema). Requiere que themeModeScript() haya corrido en el <head>.
   * Se mantiene sincronizado con el evento `swal:themechange` de `document`.
   */
  import { getThemeMode, setThemeMode } from '../lib/themeMode.js';

  const MODES = [
    { mode: 'light', label: 'Claro', icon: '☀️' },
    { mode: 'dark', label: 'Oscuro', icon: '🌙' },
    { mode: 'system', label: 'Sistema', icon: '💻' },
  ];

  let current = $state('light');

  $effect(() => {
    current = getThemeMode();
    /** @param {Event} e */
    const sync = (e) => {
      const m = /** @type {CustomEvent} */ (e).detail?.mode;
      current = m ?? getThemeMode();
    };
    document.addEventListener('swal:themechange', sync);
    return () => document.removeEventListener('swal:themechange', sync);
  });

  /** @param {string} mode */
  function choose(mode) {
    setThemeMode(mode);
    current = getThemeMode();
  }
</script>

<div class="theme-mode-switch swal-chamfer-sm" data-testid="theme-mode-switch" role="group" aria-label="Selector de Tema">
  {#each MODES as m (m.mode)}
    <button
      type="button"
      class="theme-btn"
      class:active={current === m.mode}
      data-testid="theme-btn-{m.mode}"
      data-mode={m.mode}
      aria-pressed={current === m.mode}
      title={m.label}
      onclick={() => choose(m.mode)}
    >
      <span class="theme-icon" aria-hidden="true">{m.icon}</span>
      <span class="theme-label swal-kicker">{m.label}</span>
    </button>
  {/each}
</div>

<style>
  .theme-mode-switch { display: inline-flex; align-items: center; background: var(--swal-bg-surface); padding: 2px; border: 1px solid var(--swal-border); gap: 2px; }
  .theme-btn { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: transparent; border: none; color: var(--swal-text-muted); cursor: pointer; transition: all 150ms ease; }
  .theme-btn:hover { background: var(--swal-hover-bg); color: var(--swal-text); }
  .theme-btn:focus-visible { outline: 2px solid var(--swal-text); outline-offset: 2px; }
  .theme-btn.active { background: var(--swal-accent); color: var(--swal-accent-contrast); }
  .theme-btn.active .theme-label { color: var(--swal-accent-contrast); }
  .theme-icon { font-size: 0.85rem; line-height: 1; }
  /* Responsive: sin etiquetas en pantallas pequenas */
  @media (max-width: 390px) {
    .theme-label { display: none; }
    .theme-btn { padding: 4px; }
  }
</style>
