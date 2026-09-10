import React from 'react';
import { cn, getOrderStatusBadge } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'secondary', children, ...props }) => {
  const variants = {
    primary: 'bg-rose-100 text-rose-800 border-rose-200',
    secondary: 'bg-cream-100 text-chocolate-800 border-cream-300',
    outline: 'border-chocolate-300 text-chocolate-700 bg-transparent',
    gold: 'bg-amber-50 text-amber-900 border-amber-300 font-semibold',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    warning: 'bg-amber-50 text-amber-800 border-amber-300',
    danger: 'bg-rose-50 text-rose-800 border-rose-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const badgeInfo = getOrderStatusBadge(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border shadow-2xs',
        badgeInfo.color,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {badgeInfo.label}
    </span>
  );
};
