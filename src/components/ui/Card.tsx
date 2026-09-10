import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  active?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, active = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl bg-white/95 border border-cream-200/90 p-5 shadow-soft transition-all duration-200 backdrop-blur-xs',
          hoverable && 'hover:border-rose-300 hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer',
          active && 'border-2 border-rose-600 ring-2 ring-rose-100 shadow-rose-glow/20 bg-rose-50/30',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
