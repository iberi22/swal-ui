<script lang="ts">
  export let variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'neutral';
  export let size: 'sm' | 'md' = 'sm';
  export let pulse = false;

  const colors = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    neutral: 'bg-[var(--swal-surface)] text-[var(--swal-text-secondary)] border-[var(--swal-border)]',
  };
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };
</script>

<span
  class="inline-flex items-center gap-1.5 font-medium rounded-full border {colors[variant]} {sizes[size]} {pulse ? 'animate-pulse' : ''}"
>
  {#if variant !== 'neutral'}
    <span class="w-1.5 h-1.5 rounded-full bg-current" />
  {/if}
  <slot />
</span>
