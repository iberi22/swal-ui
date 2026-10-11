<script>
  import { getIcon } from '../lib/icons.js';

  // name: registry key (ICONS / registerIcons). paths: own array of `d`
  // attributes, takes priority. label: when given, the icon is meaningful and
  // exposed to screen readers; without label it is decorative (aria-hidden).
  let { name = '', paths = undefined, size = 20, strokeWidth = 1.75, label = undefined, ...rest } = $props();

  let d = $derived(paths ?? getIcon(name) ?? []);
</script>

<svg
  class="swal-icon"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
  focusable="false"
  {...rest}
>
  {#each d as p (p)}
    <path d={p} />
  {/each}
</svg>

<style>
  .swal-icon {
    flex-shrink: 0;
    display: block;
  }
</style>
