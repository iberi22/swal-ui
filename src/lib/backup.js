/**
 * SWAL backup — formato minimo de respaldo/restauracion de datos locales.
 * La persistencia concreta la hace cada app mediante callbacks.
 *
 * Formato: { format:'swal-backup/v1', appId, createdAt, schemaVersion, stores:{ [name]: any[] } }
 */

export const BACKUP_FORMAT = 'swal-backup/v1';
/** Limite por defecto al leer un archivo (50 MB). */
export const DEFAULT_MAX_BACKUP_BYTES = 50 * 1024 * 1024;

/**
 * @param {{appId: string, schemaVersion?: number|string, collect: () => Promise<Record<string, any[]>> | Record<string, any[]>}} opts
 */
export async function createBackup({ appId, schemaVersion = 1, collect }) {
  if (!appId) throw new Error('createBackup: appId requerido');
  if (typeof collect !== 'function') throw new Error('createBackup: collect requerido');
  const stores = await collect();
  if (!stores || typeof stores !== 'object' || Array.isArray(stores)) {
    throw new Error('createBackup: collect debe devolver { nombre: [...] }');
  }
  return {
    format: BACKUP_FORMAT,
    appId,
    createdAt: new Date().toISOString(),
    schemaVersion,
    stores,
  };
}

/** Descarga el backup como archivo JSON (solo navegador). */
export function downloadBackup(backup, filename) {
  const name =
    filename || `${backup.appId}-backup-${String(backup.createdAt).slice(0, 10)}.json`;
  const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return name;
}

/**
 * Valida la forma de un backup ya parseado. Lanza Error con mensaje claro.
 * @param {any} data
 * @param {{appId?: string}} [opts]
 */
export function validateBackup(data, { appId } = {}) {
  if (!data || typeof data !== 'object' || data.format !== BACKUP_FORMAT) {
    throw new Error('Archivo de respaldo no valido (formato desconocido)');
  }
  if (typeof data.appId !== 'string' || !data.appId) {
    throw new Error('Respaldo invalido: falta appId');
  }
  if (appId && data.appId !== appId) {
    throw new Error(`El respaldo pertenece a otra app (${data.appId}, se esperaba ${appId})`);
  }
  if (!data.stores || typeof data.stores !== 'object' || Array.isArray(data.stores)) {
    throw new Error('Respaldo invalido: falta stores');
  }
  for (const [k, v] of Object.entries(data.stores)) {
    if (!Array.isArray(v)) throw new Error(`Respaldo invalido: el store "${k}" no es una lista`);
  }
  return data;
}

/**
 * Lee y valida un File/Blob de respaldo.
 * @param {Blob} file
 * @param {{appId?: string, maxBytes?: number}} [opts]
 */
export async function readBackupFile(file, { appId, maxBytes = DEFAULT_MAX_BACKUP_BYTES } = {}) {
  if (!file) throw new Error('No se selecciono ningun archivo');
  if (file.size > maxBytes) {
    throw new Error(`El archivo excede el limite de ${Math.round(maxBytes / 1024 / 1024)} MB`);
  }
  let data;
  try {
    data = JSON.parse(await file.text());
  } catch {
    throw new Error('El archivo no es JSON valido');
  }
  return validateBackup(data, { appId });
}

/** Cuenta registros por store. */
export function countStores(backup) {
  return Object.fromEntries(Object.entries(backup.stores).map(([k, v]) => [k, v.length]));
}

/**
 * Restaura delegando en la app.
 * @param {any} backup
 * @param {{apply: (name: string, records: any[], mode: 'replace'|'merge') => Promise<void>|void, onConflict?: 'replace'|'merge'}} opts
 * @returns {Promise<Record<string, number>>} registros aplicados por store
 */
export async function restoreBackup(backup, { apply, onConflict = 'replace' } = /** @type {any} */ ({})) {
  validateBackup(backup);
  if (typeof apply !== 'function') throw new Error('restoreBackup: apply requerido');
  if (onConflict !== 'replace' && onConflict !== 'merge') {
    throw new Error('restoreBackup: onConflict debe ser "replace" o "merge"');
  }
  const done = {};
  for (const [name, records] of Object.entries(backup.stores)) {
    await apply(name, records, onConflict);
    done[name] = records.length;
  }
  return done;
}
