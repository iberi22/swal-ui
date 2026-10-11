/**
 * @param {{appId: string, schemaVersion?: number|string, collect: () => Promise<Record<string, any[]>> | Record<string, any[]>}} opts
 */
export function createBackup({ appId, schemaVersion, collect }: {
    appId: string;
    schemaVersion?: number | string;
    collect: () => Promise<Record<string, any[]>> | Record<string, any[]>;
}): Promise<{
    format: string;
    appId: string;
    createdAt: string;
    schemaVersion: string | number;
    stores: Record<string, any[]>;
}>;
/** Descarga el backup como archivo JSON (solo navegador). */
export function downloadBackup(backup: any, filename: any): any;
/**
 * Valida la forma de un backup ya parseado. Lanza Error con mensaje claro.
 * @param {any} data
 * @param {{appId?: string}} [opts]
 */
export function validateBackup(data: any, { appId }?: {
    appId?: string;
}): any;
/**
 * Lee y valida un File/Blob de respaldo.
 * @param {Blob} file
 * @param {{appId?: string, maxBytes?: number}} [opts]
 */
export function readBackupFile(file: Blob, { appId, maxBytes }?: {
    appId?: string;
    maxBytes?: number;
}): Promise<any>;
/** Cuenta registros por store. */
export function countStores(backup: any): any;
/**
 * Restaura delegando en la app.
 * @param {any} backup
 * @param {{apply: (name: string, records: any[], mode: 'replace'|'merge') => Promise<void>|void, onConflict?: 'replace'|'merge'}} opts
 * @returns {Promise<Record<string, number>>} registros aplicados por store
 */
export function restoreBackup(backup: any, { apply, onConflict }?: {
    apply: (name: string, records: any[], mode: "replace" | "merge") => Promise<void> | void;
    onConflict?: "replace" | "merge";
}): Promise<Record<string, number>>;
/**
 * SWAL backup — formato minimo de respaldo/restauracion de datos locales.
 * La persistencia concreta la hace cada app mediante callbacks.
 *
 * Formato: { format:'swal-backup/v1', appId, createdAt, schemaVersion, stores:{ [name]: any[] } }
 */
export const BACKUP_FORMAT: "swal-backup/v1";
/** Limite por defecto al leer un archivo (50 MB). */
export const DEFAULT_MAX_BACKUP_BYTES: number;
