/**
 * SWAL Toast — store global de notificaciones.
 * Portado de edge-hive-admin/context/ToastContext.tsx.
 *
 * Uso:
 *   import { toast } from '@swal/ui/toast';
 *   import { Toaster } from '@swal/ui';
 *
 *   // En el layout raíz (una sola vez):
 *   <Toaster />
 *
 *   // En cualquier parte:
 *   toast.success('Guardado');
 *   const id = toast.loading('Desplegando...');
 *   toast.dismiss(id);
 */

/** @type {{ id: string, type: string, title?: string, message: string, duration?: number }[]} */
export const toasts = $state([]);

const DEFAULT_DURATION = 5000;

function add(type, message, title, duration) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.push({ id, type, message, title, duration });
  // Auto-dismiss (los loading se cierran manualmente con dismiss)
  if (type !== 'loading') {
    setTimeout(() => dismiss(id), duration || DEFAULT_DURATION);
  }
  return id;
}

function dismiss(id) {
  const i = toasts.findIndex((t) => t.id === id);
  if (i !== -1) toasts.splice(i, 1);
}

export const toast = {
  success: (message, title, duration) => add('success', message, title, duration),
  error: (message, title, duration) => add('error', message, title, duration),
  info: (message, title, duration) => add('info', message, title, duration),
  warning: (message, title, duration) => add('warning', message, title, duration),
  /** Devuelve el id para cerrarlo manualmente con toast.dismiss(id) */
  loading: (message, title) => add('loading', message, title),
  dismiss,
};
