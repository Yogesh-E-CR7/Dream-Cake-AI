import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold' | 'soft';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-xl select-none';

    const variants = {
      primary:
        'bg-gradient-to-r from-rose-600 via-rose-700 to-burgundy-700 text-white shadow-md hover:shadow-rose-glow focus:ring-rose-500 border border-transparent',
      secondary:
        'bg-cream-100 text-chocolate-900 hover:bg-cream-200 border border-cream-300 focus:ring-rose-300',
      outline:
        'border-2 border-rose-600 text-rose-700 hover:bg-rose-50 focus:ring-rose-400 bg-transparent',
      ghost:
        'text-chocolate-700 hover:bg-cream-100 hover:text-chocolate-900 focus:ring-stone-400 bg-transparent',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
      gold:
        'bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-chocolate-950 font-semibold shadow-md hover:shadow-gold-glow focus:ring-gold-400 border border-gold-300',
      soft:
        'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 focus:ring-rose-300',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2.5 gap-2 h-10',
      lg: 'text-base px-6 py-3.5 gap-2.5 h-12 font-semibold',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
