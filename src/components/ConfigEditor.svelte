<script>
  // Portado de edge-hive-admin/components/ConfigEditor.tsx
  //
  // Formulario schema-driven sobre un Record<string, any>.
  //
  // config: Record<string, any> — valores actuales (iniciales)
  // schema: [{ key, label, type: 'string'|'number'|'boolean'|'select', options? }]
  //         Si está vacío, se infiere el tipo de cada clave de config.
  // onchange(newConfig) — emitido en cada edición (on:change)
  // onsave(newConfig)   — opcional, al pulsar Save (fallback: onchange)
  let {
    config = {},
    schema = [],
    title = 'Configuration',
    onchange,
    onsave,
  } = $props();

  // Borrador inicializado UNA vez desde config; la re-sincronización la
  // maneja el $effect de abajo (comparación JSON, sin pisar ediciones).
  // svelte-ignore state_referenced_locally
  let draft = $state({ ...config });
  let syncedJson = '';

  // Solo re-sincroniza el borrador cuando el padre cambia config de verdad
  // (comparación JSON), sin pisar ediciones en curso del usuario.
  $effect(() => {
    const cur = JSON.stringify(config);
    if (cur !== syncedJson) {
      syncedJson = cur;
      draft = { ...config };
    }
  });

  function update(key, value) {
    draft[key] = value;
    onchange?.({ ...draft });
  }

  function handleSave() {
    const next = { ...draft };
    if (onsave) onsave(next);
    else onchange?.(next);
  }

  function inferType(value) {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    return 'string';
  }

  // Campos: los del schema (en orden) + claves de config no cubiertas
  const fields = $derived.by(() => {
    const schemaKeys = new Set(schema.map((f) => f.key));
    const extra = Object.keys(config)
      .filter((k) => !schemaKeys.has(k))
      .map((k) => ({ key: k, label: k, type: inferType(config[k]) }));
    return [...schema, ...extra];
  });

  function selectOptions(options) {
    return (options ?? []).map((o) =>
      typeof o === 'string' ? { value: o, label: o } : o
    );
  }
</script>

<div class="swal-configeditor">
  <h3 class="title">{title}</h3>

  <div class="fields">
    {#each fields as field (field.key)}
      <label class="field" for="cfg-{field.key}">
        <span class="label">{field.label}</span>

        {#if field.type === 'boolean'}
          <input
            id="cfg-{field.key}"
            type="checkbox"
            checked={!!draft[field.key]}
            onchange={(e) => update(field.key, e.currentTarget.checked)}
          />
        {:else if field.type === 'select'}
          <select
            id="cfg-{field.key}"
            value={draft[field.key] ?? ''}
            onchange={(e) => update(field.key, e.currentTarget.value)}
          >
            {#each selectOptions(field.options) as opt (opt.value)}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        {:else if field.type === 'number'}
          <input
            id="cfg-{field.key}"
            type="number"
            value={draft[field.key] ?? ''}
            oninput={(e) => update(field.key, e.currentTarget.value === '' ? '' : Number(e.currentTarget.value))}
          />
        {:else}
          <input
            id="cfg-{field.key}"
            type="text"
            value={draft[field.key] ?? ''}
            oninput={(e) => update(field.key, e.currentTarget.value)}
          />
        {/if}
      </label>
    {/each}
  </div>

  <div class="footer">
    <button class="save" onclick={handleSave}>Save Configuration</button>
  </div>
</div>

<style>
  .swal-configeditor {
    background: var(--swal-surface);
    border: 1px solid var(--swal-border);
    border-radius: var(--swal-radius-lg);
    padding: var(--swal-space-6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    min-width: 0;
    max-width: 100%;
  }

  .title {
    margin: 0 0 var(--swal-space-4);
    font-size: var(--swal-font-size-lg);
    font-weight: 500;
    color: var(--swal-text);
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: var(--swal-space-4);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--swal-space-1);
  }

  .label {
    font-size: var(--swal-font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--swal-text-secondary);
  }

  input[type='text'],
  input[type='number'],
  select {
    width: 100%;
    background: var(--swal-void);
    border: 1px solid var(--swal-border-light);
    border-radius: var(--swal-radius);
    padding: var(--swal-space-2) var(--swal-space-3);
    font-family: var(--swal-font-mono);
    font-size: var(--swal-font-size-sm);
    color: var(--swal-text);
    outline: none;
    transition: border-color var(--swal-transition-fast);
  }

  input[type='text']:focus,
  input[type='number']:focus,
  select:focus {
    border-color: var(--swal-accent-orange);
  }

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    accent-color: var(--swal-accent-orange);
    cursor: pointer;
  }

  select option {
    background: var(--swal-elevated);
    color: var(--swal-text);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--swal-space-5);
  }

  .save {
    padding: var(--swal-space-2) var(--swal-space-4);
    background: var(--swal-accent-orange);
    color: var(--swal-text-inverse);
    font-weight: 700;
    font-size: var(--swal-font-size-sm);
    border: none;
    border-radius: var(--swal-radius);
    cursor: pointer;
    transition: opacity var(--swal-transition-fast);
    box-shadow: var(--swal-shadow-neon-orange);
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  .save:hover { opacity: 0.9; }
  .save:active { transform: scale(0.98); }

  @media (max-width: 640px) {
    .swal-configeditor { padding: var(--swal-space-4); }
  }
</style>
