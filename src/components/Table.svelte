<script>
  // columns: [{ key, label, width?, align? }]
  // rows: [{ key: value }]
  // cell: snippet opcional — {@render cell(row, col)} para celdas custom (badges, colores, etc.)
  // header: snippet opcional — {@render header(col)} para headers custom (sortable, etc.)
  // empty: snippet opcional — {@render empty()} para reemplazar la caja de estado vacío por defecto
  let {
    columns = [],
    rows = [],
    variant = 'default', // 'default' | 'compact'
    loading = false,
    emptyTitle = 'Lista vacía',
    emptyMessage = 'No hay elementos para mostrar.',
    onLoadDemo = null,
    demoButtonText = '✨ Cargar datos de demostración',
    isFiltered = false,
    onClearFilters = null,
    cell,
    header,
    empty,
  } = $props();

  function cellStyle(col) {
    const parts = [];
    if (col.width) parts.push(`width: ${col.width}`);
    if (col.align) parts.push(`text-align: ${col.align}`);
    return parts.length ? parts.join(';') : undefined;
  }
</script>

<div class="swal-table-wrap swal-scrollbar">
  <table class={variant}>
    <thead>
      <tr>
        {#each columns as col}
          <th scope="col" style={cellStyle(col)}>
            {#if header}
              {@render header(col)}
            {:else}
              {col.label}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if loading}
        {#each Array(3) as _, i}
          <tr class="swal-skeleton-row">
            {#each columns as col}
              <td><div class="swal-skeleton-bar"></div></td>
            {/each}
          </tr>
        {/each}
      {:else if rows.length === 0}
        <tr>
          <td colspan={columns.length} class="swal-table-empty">
            {#if empty}
              {@render empty()}
            {:else}
              <div class="swal-empty-box">
                <p class="swal-empty-title">{isFiltered ? 'Sin coincidencias' : emptyTitle}</p>
                <p class="swal-empty-desc">
                  {isFiltered ? 'Ningún registro coincide con los filtros aplicados.' : emptyMessage}
                </p>
                {#if isFiltered && onClearFilters}
                  <button type="button" class="swal-btn-secondary" onclick={onClearFilters}>
                    Limpiar filtros
                  </button>
                {:else if onLoadDemo}
                  <button type="button" class="swal-btn-demo" onclick={onLoadDemo}>
                    {demoButtonText}
                  </button>
                {/if}
              </div>
            {/if}
          </td>
        </tr>
      {:else}
        {#each rows as row}
          <tr>
            {#each columns as col}
              <td style={col.align ? `text-align: ${col.align}` : undefined}>
                {#if cell}
                  {@render cell(row, col)}
                {:else}
                  {row[col.key]}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<style>
  .swal-table-wrap {
    overflow-x: auto;
    border-radius: var(--swal-radius, 8px);
    border: 1px solid var(--swal-border, #2d2a26);
    background: var(--swal-bg, #121110);
    font-family: var(--swal-font, system-ui, sans-serif);
  }
  table {
    width: 100%;
    font-size: var(--swal-font-size-sm, 0.875rem);
    border-collapse: collapse;
  }
  thead tr {
    background: var(--swal-surface, #1c1a17);
    color: var(--swal-text-secondary, #a8a29e);
  }
  th {
    padding: var(--swal-space-3, 0.75rem) var(--swal-space-4, 1rem);
    text-align: left;
    font-weight: 500;
    font-size: var(--swal-font-size-xs, 0.75rem);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  td {
    padding: var(--swal-space-3, 0.75rem) var(--swal-space-4, 1rem);
    color: var(--swal-text, #f5f5f4);
  }
  .compact td { padding: var(--swal-space-2, 0.5rem) var(--swal-space-4, 1rem); }
  tbody tr {
    border-top: 1px solid var(--swal-border, #2d2a26);
    transition: background var(--swal-transition-fast, 150ms ease);
  }
  tbody tr:hover {
    background: var(--swal-surface-hover, #23201c);
  }

  .swal-table-empty {
    padding: 3rem 1.5rem;
    text-align: center;
  }
  .swal-empty-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.625rem;
    max-width: 24rem;
    margin: 0 auto;
  }
  .swal-empty-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--swal-text, #f5f5f4);
    margin: 0;
  }
  .swal-empty-desc {
    font-size: 0.8125rem;
    color: var(--swal-text-secondary, #a8a29e);
    margin: 0;
    line-height: 1.4;
  }
  .swal-btn-demo {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: var(--swal-radius-sm, 6px);
    background: var(--swal-accent, #eab308);
    color: #000;
    border: none;
    cursor: pointer;
    transition: transform 150ms ease, opacity 150ms ease;
  }
  .swal-btn-demo:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  .swal-btn-secondary {
    margin-top: 0.5rem;
    padding: 0.4rem 0.85rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: var(--swal-radius-sm, 6px);
    background: transparent;
    color: var(--swal-text, #f5f5f4);
    border: 1px solid var(--swal-border, #444);
    cursor: pointer;
  }

  .swal-skeleton-bar {
    height: 1rem;
    background: linear-gradient(90deg, var(--swal-surface, #1c1a17) 25%, var(--swal-surface-hover, #23201c) 50%, var(--swal-surface, #1c1a17) 75%);
    background-size: 200% 100%;
    animation: swal-skeleton 1.5s infinite;
    border-radius: 4px;
  }
  @keyframes swal-skeleton {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
