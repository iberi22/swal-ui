<script>
  /**
   * PrefsEditor — Editor generico de preferencias a partir de un PrefsSchema.
   * Modulos agrupados (interruptores) y paneles por pantalla (interruptor + opciones).
   * Puro: nunca muta `value`, emite un objeto nuevo por `onchange`.
   * Usa solo var(--swal-*) y las utilidades .swal-*.
   */
  import { moduleGroups, panelScopes } from '../lib/prefs/index.js';

  /**
   * @type {{
   *   schema: import('../lib/prefs/types').PrefsSchema,
   *   value: import('../lib/prefs/types').Preferences,
   *   onchange: (p: import('../lib/prefs/types').Preferences) => void,
   *   sections?: Array<'modules' | 'panels'>
   * }}
   */
  let { schema, value, onchange, sections = ['modules', 'panels'] } = $props();

  const uid = `pe${Math.random().toString(36).slice(2, 8)}`;
  const groups = $derived(moduleGroups(schema));
  const scopes = $derived(panelScopes(schema));

  function setModule(id, on) {
    onchange({ ...value, modules: { ...value.modules, [id]: on } });
  }

  function setPanel(id, on) {
    const cur = value.panels[id] ?? { enabled: true, options: {} };
    onchange({ ...value, panels: { ...value.panels, [id]: { ...cur, enabled: on } } });
  }

  function setOption(panelId, optId, v) {
    const cur = value.panels[panelId] ?? { enabled: true, options: {} };
    onchange({
      ...value,
      panels: { ...value.panels, [panelId]: { ...cur, options: { ...cur.options, [optId]: v } } },
    });
  }

  function onNumber(panelId, optId, e, min, max) {
    const el = e.currentTarget;
    const n = Number(el.value);
    if (el.value === '' || !Number.isFinite(n)) return;
    setOption(panelId, optId, Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n)));
  }

  const modOn = (id, def) => value.modules[id] ?? def;
  const panOn = (id, def) => value.panels[id]?.enabled ?? def;
  const optVal = (panelId, optId, def) =>
    value.panels[panelId]?.options?.[optId] ?? def;
</script>

<div class="pe" data-testid="prefs-editor">
  {#if sections.includes('modules')}
    <section class="sec" aria-label="Menú">
      {#each groups as g (g.group)}
        <h3 class="swal-kicker head"><span class="swal-tick" aria-hidden="true"></span> {g.group}</h3>
        <ul class="grid">
          {#each g.modules as m (m.id)}
            {@const on = m.required ? true : modOn(m.id, m.default)}
            <li class="swal-card-frame">
              <div class="swal-card-inner row">
                <label class="txt" for="{uid}-m-{m.id}">
                  <span class="name">{m.label}</span>
                  {#if m.required}
                    <span class="help lock">Siempre visible</span>
                  {:else if m.help}
                    <span class="help">{m.help}</span>
                  {/if}
                </label>
                <input
                  id="{uid}-m-{m.id}"
                  type="checkbox"
                  role="switch"
                  class="sw"
                  checked={on}
                  disabled={m.required}
                  onchange={(e) => setModule(m.id, e.currentTarget.checked)}
                />
              </div>
            </li>
          {/each}
        </ul>
      {/each}
    </section>
  {/if}

  {#if sections.includes('panels')}
    <section class="sec" aria-label="Paneles">
      {#each scopes as s (s.scope)}
        <h3 class="swal-kicker head"><span class="swal-tick" aria-hidden="true"></span> {s.scope}</h3>
        <ul class="grid">
          {#each s.panels as p (p.id)}
            {@const on = p.required ? true : panOn(p.id, p.default)}
            <li class="swal-card-frame">
              <div class="swal-card-inner panel">
                <div class="row">
                  <label class="txt" for="{uid}-p-{p.id}">
                    <span class="name">{p.label}</span>
                    {#if p.required}
                      <span class="help lock">Siempre visible</span>
                    {:else if p.help}
                      <span class="help">{p.help}</span>
                    {/if}
                  </label>
                  <input
                    id="{uid}-p-{p.id}"
                    type="checkbox"
                    role="switch"
                    class="sw"
                    checked={on}
                    disabled={p.required}
                    onchange={(e) => setPanel(p.id, e.currentTarget.checked)}
                  />
                </div>
                {#each p.options ?? [] as o (o.id)}
                  {@const oid = `${uid}-o-${p.id}-${o.id}`}
                  {@const cur = optVal(p.id, o.id, o.default)}
                  <div class="opt" class:off={!on}>
                    {#if o.type === 'toggle'}
                      <label class="olabel" for={oid}>{o.label}</label>
                      <input
                        id={oid}
                        type="checkbox"
                        role="switch"
                        class="sw"
                        checked={cur === true}
                        disabled={!on}
                        onchange={(e) => setOption(p.id, o.id, e.currentTarget.checked)}
                      />
                    {:else if o.type === 'select'}
                      <span class="olabel" id="{oid}-l">{o.label}</span>
                      <div class="seg" role="group" aria-labelledby="{oid}-l">
                        {#each o.choices ?? [] as c (c.value)}
                          <button
                            type="button"
                            class="segbtn"
                            class:on={cur === c.value}
                            aria-pressed={cur === c.value}
                            disabled={!on}
                            onclick={() => setOption(p.id, o.id, c.value)}
                          >{c.label}</button>
                        {/each}
                      </div>
                    {:else}
                      <label class="olabel" for={oid}>{o.label}</label>
                      <input
                        id={oid}
                        type="number"
                        class="num"
                        value={cur}
                        min={o.min}
                        max={o.max}
                        step={o.step ?? 1}
                        disabled={!on}
                        onchange={(e) => onNumber(p.id, o.id, e, o.min, o.max)}
                      />
                    {/if}
                    {#if o.help}<span class="help full">{o.help}</span>{/if}
                  </div>
                {/each}
              </div>
            </li>
          {/each}
        </ul>
      {/each}
    </section>
  {/if}
</div>

<style>
  .pe { display: flex; flex-direction: column; gap: 1.25rem; font-family: var(--swal-font-sans, inherit); color: var(--swal-text); }
  .sec { display: flex; flex-direction: column; gap: 0.625rem; }
  .head { margin: 0.5rem 0 0; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
  .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: 0.5rem; align-items: start; }
  @media (min-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } }
  .swal-card-frame { min-width: 0; }
  .panel { display: flex; flex-direction: column; }
  .row { display: flex; align-items: center; gap: 0.75rem; padding: 0.375rem 0.75rem; min-height: 56px; }
  .txt { flex: 1; min-width: 0; min-height: 44px; display: flex; flex-direction: column; justify-content: center; gap: 0.125rem; cursor: pointer; }
  .name { font-size: 0.9375rem; font-weight: 600; color: var(--swal-text); }
  .help { font-size: 0.8125rem; line-height: 1.35; color: var(--swal-text-muted); }
  .help.lock { font-family: var(--swal-font-mono, monospace); font-size: 0.6875rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .help.full { flex-basis: 100%; }
  .opt { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem 0.75rem; padding: 0.375rem 0.75rem 0.625rem; border-top: 1px dashed var(--swal-border); min-height: 52px; }
  .opt.off { opacity: 0.55; }
  .olabel { font-size: 0.875rem; color: var(--swal-text-secondary); min-height: 44px; display: flex; align-items: center; flex: 1 1 auto; }

  /* Interruptor: input real, aspecto propio. Area tactil de 44px con un margen invisible. */
  .sw {
    appearance: none; -webkit-appearance: none; flex-shrink: 0; position: relative; cursor: pointer;
    width: 44px; height: 24px; margin: 10px 0; border: 1px solid var(--swal-border-strong);
    background: var(--swal-bg-elevated); transition: background 120ms ease;
  }
  .sw::after {
    content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px;
    background: var(--swal-text-muted); transition: transform 120ms ease, background 120ms ease;
  }
  .sw:checked { background: var(--swal-accent); border-color: var(--swal-accent); }
  .sw:checked::after { transform: translateX(20px); background: var(--swal-accent-contrast); }
  .sw:disabled { cursor: not-allowed; opacity: 0.6; }
  .sw:focus-visible, .segbtn:focus-visible, .num:focus-visible { outline: 2px solid var(--swal-text); outline-offset: 2px; }

  .seg { display: inline-flex; flex-wrap: wrap; border: 1px solid var(--swal-border-strong); background: var(--swal-bg-elevated); }
  .segbtn {
    min-height: 44px; min-width: 44px; padding: 0 0.875rem; border: 0; background: transparent; cursor: pointer;
    font: inherit; font-size: 0.8125rem; color: var(--swal-text-secondary);
  }
  .segbtn + .segbtn { border-left: 1px solid var(--swal-border); }
  .segbtn.on { background: var(--swal-accent); color: var(--swal-accent-contrast); font-weight: 600; }
  .segbtn:disabled { cursor: not-allowed; }
  .num {
    width: 5.5rem; min-height: 44px; padding: 0 0.5rem; font: inherit; text-align: right;
    background: var(--swal-bg-elevated); color: var(--swal-text); border: 1px solid var(--swal-border-strong);
  }
  .num:disabled { cursor: not-allowed; }
</style>
