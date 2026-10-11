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
export function swalFade(node: any, { duration, delay }?: {
    duration?: number;
    delay?: number;
}): {
    duration: number;
    delay: number;
    css: (t: any) => string;
};
export function swalSlide(node: any, { duration, delay, distance, direction }?: {
    duration?: number;
    delay?: number;
    distance?: number;
    direction?: string;
}): {
    duration: number;
    delay: number;
    css: (t: any) => string;
};
