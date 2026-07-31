import * as React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger' | 'cyan';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  glow?: boolean;
}

/**
 * SWAL Button — base del design system
 * Variantes: default (orange), outline, ghost, danger, cyan
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', glow = false, ...props }, ref) => {
    const variants = {
      default:
        'bg-hive-orange text-slate-950 font-semibold hover:bg-hive-orange/90' +
        (glow ? ' shadow-neon-orange' : ''),
      outline:
        'border border-white/15 bg-transparent hover:bg-white/5 hover:text-white',
      ghost: 'bg-transparent hover:bg-white/5 hover:text-white',
      danger: 'bg-red-500 text-white hover:bg-red-500/90 shadow-neon-red',
      cyan: 'bg-hive-cyan text-slate-950 font-semibold hover:bg-hive-cyan/90' +
        (glow ? ' shadow-neon-cyan' : ''),
    };

    const sizes = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-9 rounded-md px-3 text-xs',
      lg: 'h-11 rounded-md px-8 text-base',
      icon: 'h-10 w-10',
    };

    const base =
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    return (
      <button
        className={cn(base, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'SwalButton';

export { Button };
