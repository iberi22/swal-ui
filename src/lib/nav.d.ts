/**
 * Un item de navegacion esta activo si su ruta coincide exactamente o es un
 * ancestro por segmento ("/dashboard" activa "/dashboard/orders" pero no
 * "/dashboard2"). "/" solo coincide exacto, o la landing marcaria todo.
 * @param {{href: string, exact?: boolean}} item
 * @param {string} currentPath
 */
export function isNavActive(item: {
    href: string;
    exact?: boolean;
}, currentPath?: string): any;
/** Primer item activo, para mostrar la seccion actual en la barra movil. */
export function findCurrentNav(items: any, currentPath?: string): any;
