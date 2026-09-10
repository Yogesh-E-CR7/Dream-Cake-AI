import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  className?: string;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  className,
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-chocolate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          'relative w-full rounded-2xl bg-[#FFFDF9] border border-cream-300 p-6 sm:p-8 shadow-soft-xl transition-all animate-slide-up z-10 my-8 max-h-[90vh] flex flex-col',
          maxWidths[maxWidth],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between pb-4 mb-4 border-b border-cream-200">
            <div>
              {title && typeof title === 'string' ? (
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-900">{title}</h3>
              ) : (
                title
              )}
              {subtitle && <p className="text-xs sm:text-sm text-chocolate-600 mt-1">{subtitle}</p>}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-chocolate-400 hover:bg-cream-100 hover:text-chocolate-800 transition-colors focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};
