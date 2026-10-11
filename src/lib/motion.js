/**
 * SWAL Motion — animation utilities
 *
 * Approach: CSS-first, GPU composited, no dependencies.
 * These are Svelte transition functions (for transition:/in:/out:),
 * not actions. Usage:
 *
 *   <div transition:swalFade={{ duration: 200 }}>
 *   <div transition:swalSlide={{ direction: 'up', distance: 8 }}>
 *
 * NOTE: in Astro, transitions only run in hydrated islands.
 * For static HTML use the CSS classes (.swal-enter, etc.).
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
