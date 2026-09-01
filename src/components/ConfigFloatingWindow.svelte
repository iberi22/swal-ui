<script lang="ts">
  import { onMount } from 'svelte';
  let open = $state(false);
  let theme = $state('antigravity');
  let accent = $state('#8B5CF6');
  let accentLight = $state('#7C3AED');

  onMount(() => {
    theme = localStorage.getItem('swal-theme') || 'antigravity';
    accent = localStorage.getItem('swal-accent-dark') || '#8B5CF6';
    accentLight = localStorage.getItem('swal-accent-light') || '#7C3AED';
    apply();
  });

  function apply() {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty('--swal-accent', theme === 'antigravity-light' ? accentLight : accent);
    document.documentElement.style.setProperty('--swal-accent-custom', accentLight);
    localStorage.setItem('swal-theme', theme);
    localStorage.setItem('swal-accent-dark', accent);
    localStorage.setItem('swal-accent-light', accentLight);
  }

  function toggleTheme() {
    theme = theme === 'antigravity' ? 'antigravity-light' : 'antigravity';
    apply();
  }
</script>

{#if open}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onclick={() => open = false} role="presentation">
    <div class="w-full max-w-[900px] max-h-[620px] rounded-[16px] overflow-hidden bg-[var(--swal-bg)] border border-[var(--swal-border-light)] shadow-2xl flex text-[var(--swal-text)]" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <!-- Sidebar — clon 1:1 captura 21:18 -->
      <aside class="w-[200px] shrink-0 bg-[#101010] border-r border-white/10 p-3 flex flex-col gap-1 text-sm overflow-y-auto swal-scrollbar">
        <div class="text-[11px] tracking-widest text-white/40 px-2 py-1">Settings</div>
        <div class="px-2 py-1.5 rounded-lg bg-white/10 text-white font-medium">General</div>
        <div class="px-2 py-1.5 rounded-lg hover:bg-white/5 text-white/60 cursor-pointer">Appearance</div>
        <div class="px-2 py-1.5 rounded-lg hover:bg-white/5 text-white/60 cursor-pointer">Models</div>
        <div class="px-2 py-1.5 rounded-lg hover:bg-white/5 text-white/60 cursor-pointer">Customizations</div>
        <div class="px-2 py-1.5 rounded-lg hover:bg-white/5 text-white/60 cursor-pointer">Browser</div>
        <div class="px-2 py-1.5 rounded-lg hover:bg-white/5 text-white/60 cursor-pointer">App</div>
        <div class="h-px bg-white/10 my-2"></div>
        <div class="text-[11px] text-white/30 px-2">Projects</div>
        <div class="px-2 py-1 text-white/50">proyectosSWAL</div>
        <div class="px-2 py-1 text-white/30 text-xs">Show all</div>
        <div class="mt-auto pt-4 text-xs text-white/30 px-2">Shortcuts<br/>Provide Feedback</div>
      </aside>
      <!-- Content — clon filas captura -->
      <div class="flex-1 overflow-y-auto p-6 bg-[#151515] swal-scrollbar">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-lg font-bold">General</h2>
            <p class="text-xs text-white/40">Configure agent execution, queued message delivery, and permissions.</p>
          </div>
          <button onclick={() => open = false} class="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60">✕</button>
        </div>

        <div class="space-y-6">
          <!-- Appearance — tema dual + color personalizable -->
          <div>
            <h3 class="text-sm font-bold mb-3">Appearance — Tema Antigravity</h3>
            <div class="rounded-xl border border-white/10 overflow-hidden bg-[#1A1A1D]">
              <div class="flex justify-between items-center p-3.5 border-b border-white/5">
                <div>
                  <div class="text-sm font-medium">Tema</div>
                  <div class="text-xs text-white/40">Cambia entre Dark y Hueso (light)</div>
                </div>
                <button onclick={toggleTheme} class="px-3 py-1.5 rounded-full text-xs font-bold border transition-all" style="background: {theme === 'antigravity-light' ? '#FDFCF8' : '#0A0A0B'}; color:{theme === 'antigravity-light' ? '#1C1917' : 'white'}; border-color: rgba(255,255,255,0.15)">{theme === 'antigravity-light' ? 'Hueso Light' : 'Dark'}</button>
              </div>
              <div class="flex justify-between items-center p-3.5 border-b border-white/5">
                <div>
                  <div class="text-sm font-medium">Color personalizable — Dark</div>
                  <div class="text-xs text-white/40">Acento para data-theme="antigravity"</div>
                </div>
                <input type="color" bind:value={accent} onchange={apply} class="w-10 h-7 rounded-lg bg-transparent border border-white/10 p-0.5" />
              </div>
              <div class="flex justify-between items-center p-3.5">
                <div>
                  <div class="text-sm font-medium">Color personalizable — Light hueso</div>
                  <div class="text-xs text-white/40">Acento para data-theme="antigravity-light"</div>
                </div>
                <input type="color" bind:value={accentLight} onchange={apply} class="w-10 h-7 rounded-lg bg-transparent border border-white/10 p-0.5" />
              </div>
            </div>
          </div>

          <!-- Execution — clon exacto de captura -->
          <div>
            <h3 class="text-xs font-bold text-white/80 mb-2">Execution</h3>
            <div class="rounded-xl border border-white/10 overflow-hidden bg-[#1A1A1D]">
              <div class="flex justify-between items-center p-3.5 border-b border-white/5">
                <div><div class="text-sm">Queued Messages</div><div class="text-xs text-white/40">Configure when follow-up messages are sent.</div></div>
                <div class="flex bg-[#2A2A2E] rounded-full p-0.5 text-xs"><span class="px-3 py-1 rounded-full bg-white text-black font-bold">Queue</span><span class="px-3 py-1 text-white/60">Send Immediately</span></div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold text-white/80 mb-2">Agent Settings</h3>
            <div class="rounded-xl border border-white/10 overflow-hidden bg-[#1A1A1D]">
              {#each [{l:'Security Preset',d:'Choose a predefined security preset',v:'Custom'},{l:'Outside of folders file access policy',d:'Configures how the agent tries to access files outside',v:'Always Ask'},{l:'Terminal Command Auto Execution',d:'Controls whether terminal commands require approval',v:'Proceed In Sandbox'}] as row}
                <div class="flex justify-between items-center p-3.5 border-b border-white/5 last:border-0">
                  <div class="pr-4"><div class="text-sm">{row.l}</div><div class="text-xs text-white/40">{row.d}</div></div>
                  <select class="px-3 py-1.5 rounded-lg bg-[#2A2A2E] border border-white/10 text-xs text-white/80"><option>{row.v}</option></select>
                </div>
              {/each}
              <div class="flex justify-between items-center p-3.5 border-t border-white/5">
                <div><div class="text-sm">Enable Sandbox Mode (Preview)</div><div class="text-xs text-white/40">Restricts agent tools to a secure sandbox.</div></div>
                <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked class="sr-only peer"/><div class="w-11 h-6 bg-[#2A2A2E] peer-focus:outline-none rounded-full peer peer-checked:bg-[#0A84FF] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<button onclick={() => open = true} class="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-[var(--swal-accent)] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform" aria-label="Configuración">⚙️</button>

<style>
  :global(html) { scroll-behavior: smooth; }
</style>
