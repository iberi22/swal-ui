<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import { isNavActive, findCurrentNav } from '../lib/nav.js';

  // items: [{ href, label, icon?, exact? }]. icon es un nombre del registro de
  // iconos (ver lib/icons.js). lead: snippet opcional (marca) que ocupa el lugar
  // de "seccion actual" en la barra movil y cabecera del menu en escritorio.
  let {
    items = [],
    currentPath = '/',
    open = $bindable(false),
    menuLabel = 'Menu',
    navLabel = 'Principal',
    id = 'swal-nav',
    lead,
    onnavigate,
    ...rest
  } = $props();

  // Sin JS (html sin clase `js`) el CSS muestra el menu entero y esconde el
  // boton, asi que ningun destino queda inaccesible. Con `html.js` (puesto antes
  // de pintar por el script de arranque, o aqui al montar como respaldo) el menu
  // arranca plegado en movil sin salto de layout.
  let toggleEl = $state();
  onMount(() => {
    document.documentElement.classList.add('js');
  });

  let current = $derived(findCurrentNav(items, currentPath));

  function onkeydown(e) {
    if (e.key === 'Escape' && open) {
      open = false;
      toggleEl?.focus();
    }
  }

  function onlink(item) {
    open = false;
    onnavigate?.(item);
  }
</script>

<svelte:window {onkeydown} />

<div class="swal-mobile-nav" data-nav={open ? 'open' : 'closed'} {...rest}>
  <div class="nav-bar" class:has-lead={!!lead}>
    {#if lead}
      <span class="nav-lead">{@render lead()}</span>
    {:else}
      <span class="nav-current">
        <Icon name={current?.icon ?? 'home'} size={18} />
        {current?.label ?? ''}
      </span>
    {/if}
    <button
      type="button"
      class="nav-toggle"
      bind:this={toggleEl}
      aria-controls={id}
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      <span class="when-closed"><Icon name="menu" size={20} /></span>
      <span class="when-open"><Icon name="close" size={20} /></span>
      {menuLabel}
    </button>
  </div>
  <nav {id} class="nav" aria-label={navLabel}>
    {#each items as item (item.href)}
      {@const active = isNavActive(item, currentPath)}
      <a
        href={item.href}
        class="nav-item"
        class:active
        aria-current={active ? 'page' : undefined}
        onclick={() => onlink(item)}
      >
        {#if item.icon}<Icon name={item.icon} size={18} />{/if}
        {item.label}
      </a>
    {/each}
  </nav>
</div>

<style>
  .nav { display: flex; flex-direction: column; gap: 0.125rem; padding: 0 0.5rem; }

  /* Escritorio: la barra solo existe si hay marca (lead) y sin boton. */
  .nav-bar { display: none; }
  .nav-bar.has-lead { display: flex; align-items: center; padding: 0 1rem 0.75rem; }
  .nav-bar.has-lead .nav-toggle { display: none; }
  .nav-lead { display: inline-flex; align-items: center; gap: 0.5rem; min-width: 0; }

  /* `a.nav-item` con la etiqueta y `color` con !important: la hoja de estilos
     del navegador pinta `a:-webkit-any-link` con (0,1,1) y, con color-scheme
     definido por el tema, el texto salia azul de enlace sobre el fondo (medido
     1.01:1 en Fize). Solo el fondo se anima: una transicion sobre `color`
     (que viene de un token de tema) se re-dispara al cambiar de tema. */
  a.nav-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    /* 44px: objetivo tactil minimo (WCAG 2.5.8 pide 24). */
    min-height: 44px;
    padding: 0 0.75rem;
    border-radius: var(--swal-radius-sm, 8px);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--swal-text-secondary, #a8a29e) !important;
    text-decoration: none;
    transition: background 150ms;
  }
  a.nav-item:hover {
    background: var(--swal-hover, rgba(120, 113, 108, 0.1));
    color: var(--swal-text, #f5f5f4) !important;
  }
  /* Activo: fondo tenue + acento + barra inset en el borde de entrada (no mueve
     el layout), para que no dependa solo de un velo casi invisible en claro. */
  a.nav-item.active {
    background: var(--swal-accent-muted, rgba(245, 245, 244, 0.13));
    color: var(--swal-accent, #f5f5f4) !important;
    font-weight: 600;
    box-shadow: inset 3px 0 0 var(--swal-accent, #f5f5f4);
  }

  @media (max-width: 768px) {
    .nav-bar,
    .nav-bar.has-lead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      min-height: 52px;
      padding: 0;
    }

    .nav-current {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--swal-text, #f5f5f4);
    }

    .nav-toggle {
      align-items: center;
      gap: 0.5rem;
      min-width: 44px;
      min-height: 44px;
      padding: 0 0.875rem;
      font: inherit;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--swal-text, #f5f5f4);
      background: var(--swal-surface, rgba(28, 25, 23, 0.85));
      border: 1px solid var(--swal-border-strong, rgba(120, 113, 108, 0.75));
      border-radius: var(--swal-radius, 12px);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    .nav-toggle:hover { background: var(--swal-surface-hover, rgba(41, 37, 36, 0.88)); }
    .nav-toggle:active { background: var(--swal-surface-active, rgba(54, 48, 46, 0.92)); }
    .nav-toggle .when-open { display: none; }
    [data-nav='open'] .nav-toggle .when-open { display: block; }
    [data-nav='open'] .nav-toggle .when-closed { display: none; }
    /* Sin JS (html sin `.js`) el boton no haria nada: no se pinta y el menu
       queda abierto. Con `html.js` el boton se ve y el menu parte plegado. */
    .nav-toggle,
    .nav-bar.has-lead .nav-toggle { display: none; }
    :global(html.js) .nav-toggle,
    :global(html.js) .nav-bar.has-lead .nav-toggle { display: inline-flex; }

    /* Desplegado: rejilla de dos columnas, caben los destinos sin cortar. */
    .nav {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.25rem;
      padding: 0.25rem 0 0.5rem;
    }
    :global(html.js) .swal-mobile-nav:not([data-nav='open']) .nav { display: none; }

    a.nav-item { white-space: nowrap; }
  }
</style>
