<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    compact?: boolean;
    testId?: string;
    children?: Snippet;
  }

  let {
    icon = '📦',
    title,
    description = '',
    actionLabel,
    actionHref,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
    compact = false,
    testId = 'swal-empty-state',
    children
  }: Props = $props();
</script>

<div class="swal-empty-state {compact ? 'compact' : ''}" data-testid={testId}>
  {#if icon}
    <div class="swal-empty-icon" aria-hidden="true">{icon}</div>
  {/if}
  <h3 class="swal-empty-title">{title}</h3>
  {#if description}
    <p class="swal-empty-desc">{description}</p>
  {/if}

  {#if children}
    <div class="swal-empty-extra">
      {@render children()}
    </div>
  {/if}

  {#if actionLabel || secondaryActionLabel}
    <div class="swal-empty-actions">
      {#if actionLabel}
        {#if actionHref}
          <a href={actionHref} class="swal-btn swal-btn-primary" data-testid="{testId}-action-link">
            {actionLabel}
          </a>
        {:else if onAction}
          <button type="button" class="swal-btn swal-btn-primary" onclick={onAction} data-testid="{testId}-action-btn">
            {actionLabel}
          </button>
        {/if}
      {/if}

      {#if secondaryActionLabel && onSecondaryAction}
        <button type="button" class="swal-btn swal-btn-secondary" onclick={onSecondaryAction} data-testid="{testId}-secondary-btn">
          {secondaryActionLabel}
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .swal-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--swal-space-12, 3rem) var(--swal-space-6, 1.5rem);
    background: var(--swal-bg-elevated, #1c1a17);
    border: 1px dashed var(--swal-border-strong, #3a3630);
    border-radius: var(--swal-radius-lg, 12px);
    margin: var(--swal-space-4, 1rem) 0;
    font-family: var(--swal-font, system-ui, sans-serif);
    color: var(--swal-text, #f5f5f4);
  }

  .swal-empty-state.compact {
    padding: var(--swal-space-6, 1.5rem) var(--swal-space-4, 1rem);
    margin: var(--swal-space-2, 0.5rem) 0;
  }

  .swal-empty-icon {
    font-size: 2.5rem;
    margin-bottom: var(--swal-space-3, 0.75rem);
    line-height: 1;
  }

  .compact .swal-empty-icon {
    font-size: 1.75rem;
    margin-bottom: var(--swal-space-2, 0.5rem);
  }

  .swal-empty-title {
    margin: 0;
    font-size: var(--swal-font-size-base, 1rem);
    font-weight: 600;
    color: var(--swal-text, #f5f5f4);
  }

  .swal-empty-desc {
    margin: var(--swal-space-2, 0.5rem) 0 0 0;
    font-size: var(--swal-font-size-sm, 0.875rem);
    color: var(--swal-text-secondary, #a8a29e);
    max-width: 420px;
    line-height: 1.5;
  }

  .swal-empty-extra {
    margin-top: var(--swal-space-4, 1rem);
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .swal-empty-actions {
    margin-top: var(--swal-space-5, 1.25rem);
    display: flex;
    flex-wrap: wrap;
    gap: var(--swal-space-3, 0.75rem);
    justify-content: center;
    align-items: center;
  }

  .swal-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--swal-font-size-sm, 0.875rem);
    font-weight: 500;
    padding: var(--swal-space-2, 0.5rem) var(--swal-space-4, 1rem);
    border-radius: var(--swal-radius, 8px);
    cursor: pointer;
    text-decoration: none;
    transition: all var(--swal-transition-fast, 150ms ease);
    border: 1px solid transparent;
  }

  .swal-btn:active {
    transform: scale(0.98);
  }

  .swal-btn-primary {
    background: var(--swal-brand, #22c55e);
    color: #0c0a09;
    font-weight: 600;
  }

  .swal-btn-primary:hover {
    filter: brightness(1.1);
  }

  .swal-btn-secondary {
    background: var(--swal-surface, #23201c);
    color: var(--swal-text, #f5f5f4);
    border-color: var(--swal-border, #3a3630);
  }

  .swal-btn-secondary:hover {
    background: var(--swal-surface-hover, #2c2823);
    color: #fff;
  }
</style>
