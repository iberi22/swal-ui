import * as React from 'react';
import { cn } from '../../utils/cn';

export type StatusType = 'healthy' | 'warning' | 'error' | 'offline';

export interface StatusBadgeProps {
  status: StatusType;
  pulse?: boolean;
  label?: string;
  size?: 'sm' | 'md';
}

const dotColors: Record<StatusType, string> = {
  healthy: 'bg-emerald-500 shadow-neon-cyan',
  warning: 'bg-hive-orange shadow-neon-orange',
  error: 'bg-red-500 shadow-neon-red',
  offline: 'bg-slate-600',
};

const ringColors: Record<StatusType, string> = {
  healthy: 'bg-emerald-500/20',
  warning: 'bg-orange-500/20',
  error: 'bg-red-500/20',
  offline: 'bg-slate-600/20',
};

const labelColors: Record<StatusType, string> = {
  healthy: 'text-emerald-400',
  warning: 'text-hive-orange',
  error: 'text-red-400',
  offline: 'text-slate-500',
};

/**
 * SWAL StatusBadge — indicador de estado con pulso neon
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  pulse = true,
  label,
  size = 'sm',
}) => {
  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-3 w-3';
  const containerSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-2">
      <div className={cn('relative flex items-center justify-center', containerSize)}>
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${ringColors[status]}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${dotColors[status]}`} />
      </div>
      {label && <span className={`text-xs font-mono uppercase ${labelColors[status]}`}>{label}</span>}
    </div>
  );
};

export default StatusBadge;
