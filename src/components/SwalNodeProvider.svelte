<script>
  import { setContext } from 'svelte';

  let {
    probeUrl = 'http://127.0.0.1:8006/health',
    interval = 60000,
    children,
  } = $props();

  let status = $state('checking');
  let lastCheck = $state(null);

  let nodeState = $derived({ status, lastCheck });

  setContext('swal:node', {
    get status() { return status; },
    get lastCheck() { return lastCheck; },
    get nodeState() { return nodeState; },
  });

  async function probe() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
      const res = await fetch(probeUrl, { signal: controller.signal });
      status = res.ok ? 'active' : 'inactive';
    } catch {
      status = 'inactive';
    } finally {
      clearTimeout(timeout);
      lastCheck = new Date().toISOString();
    }
  }

  $effect(() => {
    // Access props to establish reactive dependencies
    void probeUrl;
    void interval;

    // SSR guard: no window/fetch polling during server render
    if (typeof window === 'undefined') return;

    probe();

    const id = setInterval(probe, interval);
    return () => clearInterval(id);
  });
</script>

{#if children}
  {@render children(nodeState)}
{/if}
