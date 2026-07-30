/**
 * SWAL Motion — Utilidades de animación 120Hz
 * 
 * Enfoque: CSS-first, GPU composited, sin dependencias pesadas.
 * Para animaciones complejas: Motion One (framework agnostic, ~14KB).
 * Para transiciones Svelte: built-in svelte/transition (nativo, GPU).
 *
 * Uso:
 *   <div use:swalFade={{ duration: 200 }}>
 *   <div use:swalSlide={{ direction: 'up', distance: 8 }}>
 */

export function swalFade(node, { duration = 200, delay = 0 } = {}) {
  return {
    duration,
    delay,
    css: (t) => `opacity: ${t}; will-change: opacity;`
  };
}

export function swalSlide(node, { duration = 200, delay = 0, distance = 8, direction = 'up' } = {}) {
  const translations = { up: `0, ${distance}px`, down: `0, ${-distance}px`, left: `${distance}px, 0`, right: `${-distance}px, 0` };
  const translate = translations[direction] || translations.up;
  return {
    duration,
    delay,
    css: (t) => `
      transform: translate(${t * parseInt(translate.split(',')[0]) || 0}px, ${(1 - t) * parseInt(translate.split(',')[1]) || 0}px);
      opacity: ${t};
      will-change: transform, opacity;
    `
  };
}
