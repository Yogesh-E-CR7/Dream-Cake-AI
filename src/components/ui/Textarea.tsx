import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm text-chocolate-900 placeholder:text-chocolate-400 transition-all focus:outline-none focus:ring-2 shadow-sm resize-none',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-cream-300 hover:border-cream-400 focus:border-rose-500 focus:ring-rose-100',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-chocolate-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
