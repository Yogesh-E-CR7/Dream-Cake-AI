import React from 'react';
import { OrderStatus, OrderStatusHistory } from '../../types/database.types';
import { formatDate, formatDateTime } from '../../lib/utils';
import {
  FileText,
  Search,
  Tag,
  CheckCircle,
  ChefHat,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  Truck,
  PartyPopper,
  XCircle,
} from 'lucide-react';

export interface OrderTimelineProps {
  currentStatus: OrderStatus;
  history?: OrderStatusHistory[];
}

interface TimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    status: 'PENDING_REVIEW',
    label: '1. Request Submitted',
    description: 'Cake specifications sent to bakery review queue',
    icon: FileText,
  },
  {
    status: 'PRICE_CONFIRMATION',
    label: '2. Bakery Reviewing & Quote',
    description: 'Chef evaluates complexity and prepares final quote',
    icon: Tag,
  },
  {
    status: 'CONFIRMED',
    label: '3. Order Confirmed',
    description: 'Final price accepted, slot booked in baking queue',
    icon: CheckCircle,
  },
  {
    status: 'PREPARING',
    label: '4. Baking & Sponge Prep',
    description: 'Fresh artisanal sponges baked and infused',
    icon: ChefHat,
  },
  {
    status: 'DECORATING',
    label: '5. Artisan Decorating',
    description: 'Handcrafted icings, roses and toppers being applied',
    icon: Sparkles,
  },
  {
    status: 'QUALITY_CHECK',
    label: '6. Quality Check',
    description: 'Head Chef inspecting structure, finish and presentation',
    icon: ShieldCheck,
  },
  {
    status: 'READY',
    label: '7. Ready & Boxed',
    description: 'Carefully packaged in temperature-safe custom box',
    icon: PackageCheck,
  },
  {
    status: 'OUT_FOR_DELIVERY',
    label: '8. Out for Delivery / Dispatch',
    description: 'Dispatched with careful climate-controlled transit',
    icon: Truck,
  },
  {
    status: 'COMPLETED',
    label: '9. Completed & Celebrated',
    description: 'Delivered to your celebration. Enjoy every bite!',
    icon: PartyPopper,
  },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, history = [] }) => {
  const isCancelled = currentStatus === 'CANCELLED';

  const getStepIndex = (status: OrderStatus): number => {
    return TIMELINE_STEPS.findIndex((s) => s.status === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  if (isCancelled) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center">
        <XCircle className="h-10 w-10 text-red-600 mx-auto mb-2" />
        <h4 className="font-serif text-lg font-bold text-red-900">Order Cancelled</h4>
        <p className="text-xs text-red-700 mt-1">This cake request was cancelled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-cream-300">
        {TIMELINE_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;
          const Icon = step.icon;

          // Find matching history entry
          const historyEntry = history.find((h) => h.status === step.status);

          return (
            <div key={step.status} className="relative flex items-start gap-4">
              {/* Node Icon */}
              <div
                className={`absolute -left-6 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                  isCurrent
                    ? 'bg-rose-600 text-white border-rose-200 ring-4 ring-rose-100 shadow-md scale-110'
                    : isCompleted
                    ? 'bg-emerald-600 text-white border-emerald-200 shadow-2xs'
                    : 'bg-white text-chocolate-300 border-cream-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>

              {/* Step Info */}
              <div
                className={`flex-1 rounded-2xl p-4 border transition-all ${
                  isCurrent
                    ? 'bg-rose-50/70 border-rose-300 shadow-soft'
                    : isCompleted
                    ? 'bg-white/80 border-cream-200'
                    : 'bg-cream-50/40 border-cream-200 opacity-60'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isCurrent
                        ? 'text-rose-900'
                        : isCompleted
                        ? 'text-emerald-900'
                        : 'text-chocolate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  {historyEntry && (
                    <span className="text-[11px] font-mono text-chocolate-500">
                      {formatDateTime(historyEntry.created_at)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-chocolate-700 mt-1">{step.description}</p>

                {historyEntry?.message && (
                  <div className="mt-2 rounded-xl bg-white/90 border border-cream-200 p-2 text-xs text-chocolate-800 italic">
                    "{historyEntry.message}"
                    {historyEntry.updater_name && (
                      <span className="block text-[10px] font-semibold text-chocolate-500 not-italic mt-0.5">
                        — {historyEntry.updater_name}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
