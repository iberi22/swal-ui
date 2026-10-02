<script>
  import MobileNav from './MobileNav.svelte';

  // Shell generico de app: columna lateral (escritorio) / barra superior con
  // menu desplegable (movil), zona de contenido y barra superior opcional.
  // Sin marca ni rutas propias: todo entra por props y snippets.
  //   items:       [{ href, label, icon?, exact? }]
  //   currentPath: ruta actual (para marcar el item activo)
  //   brand:       snippet con logo/nombre
  //   navFooter:   snippet al pie de la barra lateral (perfil, estado, ticker)
  //   topbar:      snippet de acciones sobre el contenido
  //   children:    contenido
  let {
    items = [],
    currentPath = '/',
    showNav = true,
    menuOpen = $bindable(false),
    menuLabel = 'Menu',
    navLabel = 'Principal',
    brand,
    navFooter,
    topbar,
    children,
    ...rest
  } = $props();
</script>

<div class="swal-app-shell" {...rest}>
  {#if showNav}
    <aside class="sidebar">
      <MobileNav
        {items}
        {currentPath}
        {menuLabel}
        {navLabel}
        bind:open={menuOpen}
        lead={brand}
      />
      {#if navFooter}
        <div class="sidebar-footer">{@render navFooter()}</div>
      {/if}
    </aside>
  {/if}
  <div class="main-area">
    {#if topbar}
      <header class="topbar">{@render topbar()}</header>
    {/if}
    <main class="main-content">
      {@render children?.()}
    </main>
  </div>
</div>

<style>
  .swal-app-shell {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    max-width: 100%;
    background: var(--swal-bg);
    color: var(--swal-text);
    font-family: var(--swal-font, ui-sans-serif, system-ui, sans-serif);
  }

  /* El fondo usa --swal-surface: toma la translucidez del tema y el texto
     mantiene el contraste que el propio tema garantiza (con un rgba fijo el
     menu salia a 1.09:1 en Fize). */
  .sidebar {
    width: 200px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    background: var(--swal-surface, rgba(28, 25, 23, 0.85));
    backdrop-filter: blur(16px) saturate(1.2);
    border-right: 1px solid var(--swal-border, rgba(255, 255, 255, 0.06));
    padding: 1rem 0;
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100dvh;
    overflow-y: auto;
  }

  .sidebar-footer {
    padding: 0.75rem;
    border-top: 1px solid var(--swal-border, rgba(255, 255, 255, 0.06));
  }

  .main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* Sin min-width:0 un hijo ancho (tabla, grid) empuja el contenedor y la
       pagina se ve cortada en movil. */
    min-width: 0;
  }

  .topbar {
    min-height: 56px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--swal-space-3, 0.75rem);
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--swal-border, rgba(255, 255, 255, 0.06));
    background: var(--swal-surface, rgba(28, 25, 23, 0.85));
  }

  .main-content {
    flex: 1;
    padding: 1.5rem;
    overflow-x: hidden;
    min-width: 0;
  }

  @media (max-width: 768px) {
    .swal-app-shell { flex-direction: column; }
    .sidebar {
      width: 100%;
      height: auto;
      position: sticky;
      top: 0;
      z-index: 20;
      padding: 0.25rem 0.5rem;
      gap: 0;
      border-right: none;
      border-bottom: 1px solid var(--swal-border, rgba(255, 255, 255, 0.06));
    }
    .sidebar-footer { display: none; }
    .topbar { padding: 0 1rem; }
    .main-content { padding: 1rem; }
  }

  @media (max-width: 480px) {
    .main-content { padding: 0.75rem; }
  }
</style>
