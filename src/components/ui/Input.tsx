import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, startIcon, endIcon, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-chocolate-400">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm text-chocolate-900 placeholder:text-chocolate-400 transition-all focus:outline-none focus:ring-2 shadow-sm',
              startIcon ? 'pl-10' : '',
              endIcon ? 'pr-10' : '',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-cream-300 hover:border-cream-400 focus:border-rose-500 focus:ring-rose-100',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3.5 flex items-center text-chocolate-400">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-chocolate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
