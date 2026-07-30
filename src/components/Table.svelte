<script>
  export let columns = []; // [{key, label, width}]
  export let rows = []; // [{key: value}]
  export let variant = 'default'; // default | compact
</script>

<div class="overflow-x-auto rounded-lg border border-[var(--swal-border)]">
  <table class="w-full text-sm">
    <thead>
      <tr class="bg-[var(--swal-surface)] text-[var(--swal-text-secondary)] text-xs uppercase tracking-wider">
        {#each columns as col}
          <th class="px-4 py-3 text-left font-medium">{col.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr class="border-t border-[var(--swal-border)] hover:bg-[var(--swal-surface-hover)] transition-colors">
          {#each columns as col}
            <td class="px-4 py-3 text-[var(--swal-text)]">{row[col.key]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
