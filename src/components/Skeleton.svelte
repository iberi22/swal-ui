<script>
  export let width = '100%';
  export let height = '20px';
  export let variant = 'text'; // text | card | circle
</script>

{#if variant === 'circle'}
  <div class="rounded-full bg-[var(--swal-surface-active)] animate-pulse" style="width: {width}; height: {height};" />
{:else if variant === 'card'}
  <div class="rounded-lg bg-[var(--swal-surface)] border border-[var(--swal-border)] p-4 space-y-3" style="width: {width};">
    <div class="h-4 bg-[var(--swal-surface-active)] rounded animate-pulse w-3/4" />
    <div class="h-8 bg-[var(--swal-surface-active)] rounded animate-pulse w-full" />
    <div class="h-4 bg-[var(--swal-surface-active)] rounded animate-pulse w-1/2" />
  </div>
{:else}
  <div class="bg-[var(--swal-surface-active)] rounded animate-pulse" style="width: {width}; height: {height};" />
{/if}
