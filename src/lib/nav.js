/**
 * Un item de navegacion esta activo si su ruta coincide exactamente o es un
 * ancestro por segmento ("/dashboard" activa "/dashboard/orders" pero no
 * "/dashboard2"). "/" solo coincide exacto, o la landing marcaria todo.
 * @param {{href: string, exact?: boolean}} item
 * @param {string} currentPath
 */
export function isNavActive(item, currentPath = '/') {
  const href = item.href;
  if (href === '/' || item.exact) return currentPath === href;
  return currentPath === href || currentPath.startsWith(href.endsWith('/') ? href : href + '/');
}

/** Primer item activo, para mostrar la seccion actual en la barra movil. */
export function findCurrentNav(items, currentPath = '/') {
  // El mas especifico gana: /dashboard/orders antes que /dashboard.
  let best;
  for (const item of items) {
    if (isNavActive(item, currentPath) && (!best || item.href.length > best.href.length)) best = item;
  }
  return best;
}
