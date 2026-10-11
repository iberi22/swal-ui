/**
 * SWAL Toast — global notification store (svelte runes).
 * Type entry for `@swal/ui/toast`.
 */
export interface ToastItem {
  id: string;
  type: string;
  title?: string;
  message: string;
  duration?: number;
}
export declare const toasts: ToastItem[];
export interface ToastApi {
  success(message: string, title?: string, duration?: number): string;
  error(message: string, title?: string, duration?: number): string;
  info(message: string, title?: string, duration?: number): string;
  warning(message: string, title?: string, duration?: number): string;
  /** Returns the id so it can be closed manually with toast.dismiss(id). */
  loading(message: string, title?: string): string;
  dismiss(id: string): void;
}
export declare const toast: ToastApi;
