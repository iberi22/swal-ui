<script>
  /**
   * OnboardingWizard — Asistente de bienvenida generico: perfil → menu → paneles → listo.
   * Parte de `value`, edita una copia local y solo emite al terminar (onfinish) con
   * onboarded:true. Usa solo var(--swal-*) y las utilidades .swal-*.
   */
  import PrefsEditor from './PrefsEditor.svelte';
  import { applyPreset, defaultPrefs } from '../lib/prefs/index.js';

  /**
   * @type {{
   *   schema: import('../lib/prefs/types').PrefsSchema,
   *   value: import('../lib/prefs/types').Preferences,
   *   title?: string,
   *   onfinish: (p: import('../lib/prefs/types').Preferences) => void | Promise<void>,
   *   onskip?: () => void
   * }}
   */
  let { schema, value, title = 'Bienvenido', onfinish, onskip } = $props();

  const TOTAL = 4;
  let step = $state(1);
  let busy = $state(false);
  // Copia local: el asistente no toca `value` hasta el final.
  // svelte-ignore state_referenced_locally
  let draft = $state(structuredClone($state.snapshot(value)));

  const presets = $derived(schema.presets ?? []);
  const modulesOn = $derived(Object.values(draft.modules).filter(Boolean).length);
  const modulesTotal = $derived(Object.keys(draft.modules).length);
  const panelsOn = $derived(Object.values(draft.panels).filter((p) => p.enabled).length);
  const panelsTotal = $derived(Object.keys(draft.panels).length);

  function choose(id) {
    draft = applyPreset(schema, draft, id);
  }
  function fromScratch() {
    const d = defaultPrefs(schema);
    draft = { ...d, onboarded: draft.onboarded };
  }
  function edit(p) {
    draft = p;
  }
  async function finish() {
    if (busy) return;
    busy = true;
    try {
      await onfinish({ ...$state.snapshot(draft), onboarded: true });
    } finally {
      busy = false;
    }
  }
</script>

<div class="wz swal-blueprint-bg" data-testid="onboarding-wizard">
  <div class="sheet">
    <header class="top">
      <div class="steps" aria-hidden="true">
        {#each Array(TOTAL) as _, i}
          <span class="tick" class:done={i + 1 < step} class:cur={i + 1 === step}></span>
        {/each}
      </div>
      <p class="swal-kicker" data-testid="wizard-step" aria-live="polite">Paso {step} / {TOTAL}</p>
      {#if onskip}
        <button type="button" class="skip" onclick={() => onskip?.()}>Omitir</button>
      {/if}
    </header>

    {#if step === 1}
      <section aria-labelledby="wz-h1">
        <h1 id="wz-h1" class="h">{title}</h1>
        <p class="lead">Elige un punto de partida. Podrás ajustar el menú y los paneles en los pasos siguientes y cambiarlo cuando quieras en Ajustes.</p>
        <ul class="presets">
          {#each presets as p (p.id)}
            <li class="swal-card-frame" class:is-active={draft.preset === p.id}>
              <button type="button" class="swal-card-inner card" aria-pressed={draft.preset === p.id} onclick={() => choose(p.id)}>
                <span class="name">{p.label}</span>
                {#if p.description}<span class="desc">{p.description}</span>{/if}
              </button>
            </li>
          {/each}
          <li class="swal-card-frame">
            <button type="button" class="swal-card-inner card" onclick={fromScratch}>
              <span class="name">Empezar desde cero</span>
              <span class="desc">Valores por defecto, sin perfil.</span>
            </button>
          </li>
        </ul>
      </section>
    {:else if step === 2}
      <section aria-labelledby="wz-h2">
        <h1 class="h"><span id="wz-h2">Menú</span></h1>
        <p class="lead">Elige qué secciones aparecen en el menú lateral.</p>
        <PrefsEditor {schema} value={draft} onchange={edit} sections={['modules']} />
      </section>
    {:else if step === 3}
      <section aria-labelledby="wz-h3">
        <h1 class="h"><span id="wz-h3">Paneles</span></h1>
        <p class="lead">Decide qué paneles y ayudas aparecen dentro de cada pantalla.</p>
        <PrefsEditor {schema} value={draft} onchange={edit} sections={['panels']} />
      </section>
    {:else}
      <section aria-labelledby="wz-h4">
        <h1 class="h"><span id="wz-h4">Listo</span></h1>
        <p class="lead">Tu interfaz está configurada.</p>
        <ul class="summary">
          <li class="swal-card-frame"><div class="swal-card-inner sum"><strong data-testid="sum-modules">{modulesOn}</strong><span>de {modulesTotal} módulos activos</span></div></li>
          <li class="swal-card-frame"><div class="swal-card-inner sum"><strong data-testid="sum-panels">{panelsOn}</strong><span>de {panelsTotal} paneles activos</span></div></li>
        </ul>
      </section>
    {/if}

    <footer class="nav">
      <button type="button" class="btn ghost" onclick={() => (step -= 1)} disabled={step === 1}>Atrás</button>
      {#if step < TOTAL}
        <button type="button" class="btn primary" onclick={() => (step += 1)}>Siguiente</button>
      {:else}
        <button type="button" class="btn primary" onclick={finish} disabled={busy}>Entrar</button>
      {/if}
    </footer>
  </div>
</div>

<style>
  .wz { min-height: 100vh; padding: 1.5rem 1rem 3rem; color: var(--swal-text); font-family: var(--swal-font-sans, inherit); box-sizing: border-box; }
  .sheet { max-width: 960px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem; }
  .top { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .top .swal-kicker { margin: 0; }
  .steps { display: flex; gap: 0.375rem; }
  .tick { width: 28px; height: 6px; background: var(--swal-border-strong); transform: skewX(-24deg); }
  .tick.done { background: var(--swal-text-muted); }
  .tick.cur { background: var(--swal-accent); }
  .skip { margin-left: auto; min-height: 44px; padding: 0 0.5rem; background: transparent; border: 0; cursor: pointer; font: inherit; font-size: 0.875rem; color: var(--swal-text-secondary); text-decoration: underline; }
  .h { margin: 0; font-size: 1.75rem; font-weight: 700; letter-spacing: -0.01em; color: var(--swal-text); }
  .lead { margin: 0.5rem 0 1.25rem; max-width: 60ch; color: var(--swal-text-secondary); line-height: 1.5; }
  .presets, .summary { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
  @media (min-width: 900px) { .presets { grid-template-columns: 1fr 1fr; } .summary { grid-template-columns: 1fr 1fr; } }
  .card { width: 100%; min-height: 88px; padding: 0.875rem 1rem; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 0.25rem; border: 0; cursor: pointer; text-align: left; font: inherit; color: var(--swal-text); }
  .card:hover { background: var(--swal-surface-hover); }
  .card:focus-visible, .btn:focus-visible, .skip:focus-visible { outline: 2px solid var(--swal-text); outline-offset: 2px; }
  .name { font-size: 1rem; font-weight: 700; }
  .desc { font-size: 0.875rem; line-height: 1.4; color: var(--swal-text-muted); }
  .sum { display: flex; align-items: baseline; gap: 0.75rem; padding: 1rem; }
  .sum strong { font-size: 2rem; font-family: var(--swal-font-mono, monospace); color: var(--swal-text); }
  .sum span { color: var(--swal-text-secondary); }
  .nav { display: flex; justify-content: space-between; gap: 0.75rem; padding-top: 0.5rem; }
  .btn { min-height: 44px; min-width: 112px; padding: 0 1.25rem; font: inherit; font-weight: 600; cursor: pointer; border: 1px solid var(--swal-border-strong); background: var(--swal-surface); color: var(--swal-text); }
  .btn.primary { background: var(--swal-accent); border-color: var(--swal-accent); color: var(--swal-accent-contrast); }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
</style>
