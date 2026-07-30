/**
 * SWAL Motion — Utilidades de animación
 *
 * Enfoque: CSS-first, GPU composited, sin dependencias.
 * Son transition functions de Svelte (para transition:/in:/out:),
 * no actions. Uso:
 *
 *   <div transition:swalFade={{ duration: 200 }}>
 *   <div transition:swalSlide={{ direction: 'up', distance: 8 }}>
 *
 * NOTA: en Astro, las transiciones solo corren en islas hidratadas.
 * Para HTML estático usa las clases CSS (.swal-enter, etc.).
 */

export function swalFade(node, { duration = 200, delay = 0 } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    duration,
    delay,
    css: (t) => `opacity: ${t * o}`
  };
}

export function swalSlide(node, { duration = 200, delay = 0, distance = 8, direction = 'up' } = {}) {
  const offsets = {
    up: [0, distance],
    down: [0, -distance],
    left: [distance, 0],
    right: [-distance, 0],
  };
  const [x, y] = offsets[direction] || offsets.up;
  return {
    duration,
    delay,
    // t va 0→1 al entrar: el elemento viaja de (x, y) → (0, 0)
    css: (t) => `
      transform: translate(${(1 - t) * x}px, ${(1 - t) * y}px);
      opacity: ${t};
    `
  };
}
