<script>
  let {
    items = [], // Array of strings or objects { text, type: 'info'|'warning'|'error'|'success'|'orange' }
    speed = 'normal', // 'slow' | 'normal' | 'fast'
    paused = false,
    interactive = true,
    onclick,
    ...rest
  } = $props();

  // Speed-to-duration mapping
  const speedMap = {
    fast: '15s',
    normal: '30s',
    slow: '60s'
  };

  let duration = $derived(speedMap[speed] || speedMap.normal);
</script>

<div
  class="swal-global-ticker-container"
  class:interactive
  class:paused
  role="status"
  {onclick}
  {...rest}
>
  <div class="ticker-content" style="--ticker-duration: {duration}">
    <!-- Render list twice to ensure seamless looping if enough elements/width -->
    <div class="ticker-track">
      {#each items as item}
        <span class="ticker-item type-{typeof item === 'object' ? item.type : 'info'}">
          <span class="ticker-bullet" aria-hidden="true"></span>
          <span class="ticker-text">{typeof item === 'object' ? item.text : item}</span>
        </span>
      {/each}
    </div>
    <div class="ticker-track ticker-clone" aria-hidden="true">
      {#each items as item}
        <span class="ticker-item type-{typeof item === 'object' ? item.type : 'info'}">
          <span class="ticker-bullet"></span>
          <span class="ticker-text">{typeof item === 'object' ? item.text : item}</span>
        </span>
      {/each}
    </div>
  </div>
</div>

<style>
  /* Cinta de estado: es contexto, no contenido. Va baja, sin fondo propio y
     con los extremos desvanecidos, para que no compita con el titular ni se lea
     como texto desbordado al cortarse contra el borde. */
  .swal-global-ticker-container {
    width: 100%;
    border-bottom: 1px solid var(--swal-border);
    height: 28px;
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
    user-select: none;
    /* La mascara usa solo alfa: el color del degradado no importa.
       Ancho MEDIDO: con 48px fijos el desvanecido era el 3.9% de la cinta en
       escritorio (unos 5 caracteres a 11px) y en x=8 ya estaba al 18% de
       opacidad: se leia como texto cortado, no como un borde suave. Ahora es
       proporcional a la cinta, con suelo para movil y techo para pantallas
       anchas, y con un tramo intermedio que suaviza la entrada. */
    --ticker-fade: clamp(64px, 16%, 176px);
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      rgba(0, 0, 0, 0.35) calc(var(--ticker-fade) * 0.5),
      black var(--ticker-fade),
      black calc(100% - var(--ticker-fade)),
      rgba(0, 0, 0, 0.35) calc(100% - var(--ticker-fade) * 0.5),
      transparent
    );
    mask-image: linear-gradient(
      to right,
      transparent,
      rgba(0, 0, 0, 0.35) calc(var(--ticker-fade) * 0.5),
      black var(--ticker-fade),
      black calc(100% - var(--ticker-fade)),
      rgba(0, 0, 0, 0.35) calc(100% - var(--ticker-fade) * 0.5),
      transparent
    );
  }

  .interactive {
    cursor: pointer;
  }

  .ticker-content {
    display: flex;
    width: max-content;
  }

  .ticker-track {
    display: flex;
    align-items: center;
    white-space: nowrap;
    animation: swal-marquee-infinite var(--ticker-duration) linear infinite;
    padding-right: var(--swal-space-6);
  }

  /* Pausa al pasar el raton o al enfocar algo dentro: nadie puede leer un
     estado que se le escapa mientras lo mira (WCAG 2.2.2). */
  .paused .ticker-track,
  .swal-global-ticker-container:hover .ticker-track,
  .swal-global-ticker-container:focus-within .ticker-track {
    animation-play-state: paused;
  }

  .ticker-item {
    display: inline-flex;
    align-items: center;
    gap: var(--swal-space-2);
    margin-right: var(--swal-space-8);
    font-family: var(--swal-font-mono);
    font-size: var(--swal-font-size-xs);
    letter-spacing: 0.02em;
  }

  .ticker-bullet {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
    background: currentColor;
  }

  /* Jerarquia: el estado principal (exito) manda; los informativos bajan a
     texto apagado y solo su punto conserva color. Avisos y errores mantienen
     su tono porque son los que piden atencion. */
  .type-info,
  .type-orange {
    color: var(--swal-text-muted);
  }
  .type-info .ticker-bullet { background: var(--swal-text-faint); }
  .type-orange .ticker-bullet { background: var(--swal-warning); }

  .type-warning { color: var(--swal-warning); }
  .type-error { color: var(--swal-danger); }
  .type-success {
    color: var(--swal-success);
    font-weight: 600;
  }

  @keyframes swal-marquee-infinite {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-100%, 0, 0); }
  }

  /* Sin movimiento: la cinta deja de desplazarse y muestra todos los estados
     quietos, en varias lineas si hace falta. Sin la copia del bucle. */
  @media (prefers-reduced-motion: reduce) {
    .swal-global-ticker-container {
      height: auto;
      min-height: 28px;
      padding: 4px var(--swal-space-4);
      -webkit-mask-image: none;
      mask-image: none;
    }
    .ticker-content { width: 100%; }
    .ticker-track {
      animation: none;
      flex-wrap: wrap;
      white-space: normal;
      row-gap: 2px;
      padding-right: 0;
    }
    .ticker-clone { display: none; }
  }
</style>
