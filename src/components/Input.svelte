<script>
  export let value = '';
  export let placeholder = '';
  export let type = 'text';
  export let label = '';
  export let error = '';
</script>

{#if label}
  <label class="block text-xs font-medium text-[var(--swal-text-secondary)] mb-1.5">{label}</label>
{/if}
<input
  {type}
  {placeholder}
  bind:value
  class="w-full bg-[var(--swal-surface)] border border-[var(--swal-border)] rounded-lg px-3 py-2 text-sm
    text-[var(--swal-text)] placeholder:text-[var(--swal-text-muted)] outline-none
    transition-colors duration-150
    focus:border-[var(--swal-accent)] focus:ring-1 focus:ring-[var(--swal-accent-muted)]
    {error ? 'border-[var(--swal-danger)]' : ''}"
/>
{#if error}
  <p class="text-xs text-[var(--swal-danger)] mt-1">{error}</p>
{/if}
