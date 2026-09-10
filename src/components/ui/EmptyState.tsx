import React from 'react';
import { Button } from './Button';
import { Cake } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white/60 border border-dashed border-cream-300">
      <div className="rounded-2xl bg-rose-50 p-4 text-rose-700 shadow-xs mb-4">
        {icon || <Cake className="h-8 w-8 stroke-[1.5]" />}
      </div>
      <h3 className="font-serif text-xl font-bold text-chocolate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-chocolate-600">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} leftIcon={actionIcon}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className = 'h-24 w-full',
}) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-2xl bg-cream-200/60 animate-pulse ${className}`}
        />
      ))}
    </div>
  );
};
