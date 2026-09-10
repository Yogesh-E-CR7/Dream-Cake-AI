import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, children, id, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-xl border bg-white/90 px-3.5 py-2.5 pr-10 text-sm text-chocolate-900 transition-all focus:outline-none focus:ring-2 shadow-sm cursor-pointer',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-cream-300 hover:border-cream-400 focus:border-rose-500 focus:ring-rose-100',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-chocolate-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-chocolate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
