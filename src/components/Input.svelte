<script>
  // astro|island|client:visible|client:load
  let {
    value = $bindable(''),
    placeholder = '',
    type = 'text',
    label = '',
    error = '',
    id = `swal-input-${Math.random().toString(36).substring(2, 9)}`,
    ...rest
  } = $props();
</script>

{#if label}
  <label class="swal-label" for={id}>{label}</label>
{/if}
<input
  {id}
  {type}
  {placeholder}
  bind:value
  class="swal-input"
  class:has-error={!!error}
  aria-invalid={!!error}
  aria-describedby={error ? `${id}-error` : undefined}
  {...rest}
/>
{#if error}
  <p class="swal-error" id="{id}-error">{error}</p>
{/if}

<style>
  .swal-label {
    display: block;
    font-family: var(--swal-font);
    font-size: var(--swal-font-size-xs);
    font-weight: 500;
    color: var(--swal-text-secondary);
    margin-bottom: 6px;
  }
  .swal-input {
    width: 100%;
    background: var(--swal-surface);
    border: 1px solid var(--swal-border);
    border-radius: var(--swal-radius);
    padding: var(--swal-space-2) var(--swal-space-3);
    font-size: var(--swal-font-size-sm);
    font-family: var(--swal-font);
    color: var(--swal-text);
    outline: none;
    transition: border-color var(--swal-transition-fast), box-shadow var(--swal-transition-fast);
  }
  .swal-input::placeholder { color: var(--swal-text-muted); }
  .swal-input:focus {
    border-color: var(--swal-accent);
    box-shadow: 0 0 0 1px var(--swal-accent-muted);
  }
  .swal-input.has-error {
    border-color: var(--swal-danger);
  }
  .swal-error {
    font-family: var(--swal-font);
    font-size: var(--swal-font-size-xs);
    color: var(--swal-danger);
    margin-top: 4px;
  }
</style>
