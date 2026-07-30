<script lang="ts">
  export let variant: 'default' | 'surface' | 'elevated' | 'glass' = 'default';
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let hoverable = false;

  const base = 'rounded-lg border transition-all duration-200 will-change-transform';
  const variants = {
    default: 'bg-[var(--swal-elevated)] border-[var(--swal-border)] text-[var(--swal-text)]',
    surface: 'bg-[var(--swal-surface)] border-[var(--swal-border)] text-[var(--swal-text)]',
    elevated: 'bg-[var(--swal-elevated)] border-[var(--swal-border)] text-[var(--swal-text)] shadow-[var(--swal-shadow)]',
    glass: 'bg-[var(--swal-surface)] border-[var(--swal-border)] text-[var(--swal-text)] backdrop-blur-[8px]',
  };
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };
</script>

<div
  class="{base} {variants[variant]} {paddings[padding]} {hoverable ? 'hover:bg-[var(--swal-surface-hover)] cursor-pointer' : ''}"
  on:click
>
  <slot />
</div>
