<script>
  // columns: [{ key, label, width?, align? }]
  // rows: [{ key: value }]
  // cell: snippet opcional — {@render cell(row, col)} para celdas custom (badges, colores, etc.)
  // header: snippet opcional — {@render header(col)} para headers custom (sortable, etc.)
  let {
    columns = [],
    rows = [],
    variant = 'default', // 'default' | 'compact'
    cell,
    header,
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
    </tbody>
  </table>
</div>

<style>
  .swal-table-wrap {
    overflow-x: auto;
    border-radius: var(--swal-radius);
    border: 1px solid var(--swal-border);
    font-family: var(--swal-font);
  }
  table {
    width: 100%;
    font-size: var(--swal-font-size-sm);
    border-collapse: collapse;
  }
  thead tr {
    background: var(--swal-surface);
    color: var(--swal-text-secondary);
  }
  th {
    padding: var(--swal-space-3) var(--swal-space-4);
    text-align: left;
    font-weight: 500;
    font-size: var(--swal-font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  td {
    padding: var(--swal-space-3) var(--swal-space-4);
    color: var(--swal-text);
  }
  .compact td { padding: var(--swal-space-2) var(--swal-space-4); }
  tbody tr {
    border-top: 1px solid var(--swal-border);
    transition: background var(--swal-transition-fast);
  }
  tbody tr:hover {
    background: var(--swal-surface-hover);
  }
</style>
