import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
  icon?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn('w-full overflow-x-auto py-2 scrollbar-none', className)}>
      <div className="flex items-center min-w-max px-2 space-x-2">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick && onStepClick(step.id)}
              className={cn(
                'group flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all select-none border',
                isCurrent
                  ? 'bg-rose-700 text-white border-rose-700 shadow-md shadow-rose-200'
                  : isCompleted
                  ? 'bg-rose-50/80 text-rose-900 border-rose-200 hover:bg-rose-100'
                  : 'bg-white/60 text-chocolate-600 border-cream-200 hover:bg-cream-100'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors',
                  isCurrent
                    ? 'bg-white text-rose-700'
                    : isCompleted
                    ? 'bg-rose-600 text-white'
                    : 'bg-cream-200 text-chocolate-600'
                )}
              >
                {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : step.id}
              </span>
              <span className="whitespace-nowrap">
                {step.icon && <span className="mr-1">{step.icon}</span>}
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
