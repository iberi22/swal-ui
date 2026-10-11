/**
 * Pide al navegador que no desaloje los datos del origen.
 * @returns {Promise<'granted'|'denied'|'unsupported'>}
 */
export function requestPersistence(): Promise<"granted" | "denied" | "unsupported">;
/**
 * Estado actual del almacenamiento del origen.
 * @returns {Promise<{persisted: boolean, usageBytes: number, quotaBytes: number, ratio: number}>}
 */
export function getStorageStatus(): Promise<{
    persisted: boolean;
    usageBytes: number;
    quotaBytes: number;
    ratio: number;
}>;
/**
 * Detecta errores de cuota excedida (IndexedDB / localStorage / Cache API).
 * @param {any} err
 * @returns {boolean}
 */
export function isQuotaError(err: any): boolean;
/**
 * @param {number} bytes
 * @param {number} [decimals]
 * @returns {string}
 */
export function formatBytes(bytes: number, decimals?: number): string;
