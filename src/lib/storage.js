/**
 * SWAL storage — helpers genericos de persistencia offline-first.
 * Sin dependencias; todo con deteccion de features (SSR-safe).
 */

/** @returns {any} navigator.storage o null */
function storageManager() {
  return typeof navigator !== 'undefined' && navigator.storage ? navigator.storage : null;
}

/**
 * Pide al navegador que no desaloje los datos del origen.
 * @returns {Promise<'granted'|'denied'|'unsupported'>}
 */
export async function requestPersistence() {
  const s = storageManager();
  if (!s || typeof s.persist !== 'function') return 'unsupported';
  try {
    return (await s.persist()) ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}

/**
 * Estado actual del almacenamiento del origen.
 * @returns {Promise<{persisted: boolean, usageBytes: number, quotaBytes: number, ratio: number}>}
 */
export async function getStorageStatus() {
  const s = storageManager();
  let persisted = false;
  let usageBytes = 0;
  let quotaBytes = 0;
  if (s) {
    try {
      if (typeof s.persisted === 'function') persisted = !!(await s.persisted());
    } catch { /* ignorar */ }
    try {
      if (typeof s.estimate === 'function') {
        const e = (await s.estimate()) || {};
        usageBytes = e.usage || 0;
        quotaBytes = e.quota || 0;
      }
    } catch { /* ignorar */ }
  }
  const ratio = quotaBytes > 0 ? Math.min(usageBytes / quotaBytes, 1) : 0;
  return { persisted, usageBytes, quotaBytes, ratio };
}

/**
 * Detecta errores de cuota excedida (IndexedDB / localStorage / Cache API).
 * @param {any} err
 * @returns {boolean}
 */
export function isQuotaError(err) {
  if (!err || typeof err !== 'object') return false;
  const name = err.name || '';
  return (
    name === 'QuotaExceededError' ||
    name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err.code === 22 ||
    err.code === 1014
  );
}

/**
 * @param {number} bytes
 * @param {number} [decimals]
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 1) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / Math.pow(1024, i);
  return `${i === 0 ? v : v.toFixed(decimals)} ${units[i]}`;
}
