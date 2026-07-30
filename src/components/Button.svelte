<script lang="ts">
  import { swalSlide } from '@swal/ui/motion';

  export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled = false;
  export let loading = false;
  export let fullWidth = false;

  const base = 'inline-flex items-center justify-center font-medium transition-all duration-150 will-change-transform active:scale-[0.98]';
  const variants = {
    primary: 'bg-[var(--swal-accent)] text-white hover:bg-[var(--swal-accent-hover)] shadow-sm',
    secondary: 'bg-[var(--swal-surface)] text-[var(--swal-text)] border border-[var(--swal-border)] hover:bg-[var(--swal-surface-hover)]',
    ghost: 'text-[var(--swal-text-secondary)] hover:bg-[var(--swal-surface-hover)]',
    danger: 'bg-[var(--swal-danger)] text-white hover:opacity-90',
  };
  const sizes = { sm: 'h-8 px-3 text-xs rounded-md', md: 'h-10 px-4 text-sm rounded-lg', lg: 'h-12 px-6 text-base rounded-lg' };
</script>

<button
  class="{base} {variants[variant]} {sizes[size]} {fullWidth ? 'w-full' : ''} {disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
  {disabled}
  on:click
  use:swalSlide={{ duration: 200 }}
>
  {#if loading}
    <span class="loading-spinner w-4 h-4 mr-2" />
  {/if}
  <slot />
</button>

<style>
  .loading-spinner {
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
