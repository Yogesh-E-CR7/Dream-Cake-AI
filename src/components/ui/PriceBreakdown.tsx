import React from 'react';
import { PriceCalculation } from '../../types/ai.types';
import { formatPrice } from '../../lib/utils';
import { Sparkles, Info } from 'lucide-react';

export interface PriceBreakdownProps {
  priceCalc: PriceCalculation;
  compact?: boolean;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ priceCalc, compact = false }) => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-cream-50 border border-cream-300/80 p-5 shadow-soft">
      <div className="flex items-center justify-between pb-3 border-b border-cream-200">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-chocolate-600">
            Live Pricing Engine
          </span>
        </div>
        <span className="text-[11px] text-chocolate-500 font-medium flex items-center gap-1">
          <Info className="h-3 w-3" /> Real-time
        </span>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        {priceCalc.breakdown.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-chocolate-700">
            <span className="text-xs text-chocolate-600 font-medium">{item.label}</span>
            <span className="text-xs font-semibold text-chocolate-900">{formatPrice(item.amount)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-cream-300 flex items-baseline justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-chocolate-800 tracking-wider">
            Estimated Price
          </span>
          <p className="text-[10px] text-chocolate-500 italic mt-0.5">
            Subject to bakery final confirmation
          </p>
        </div>
        <div className="text-right">
          <span className="font-serif text-2xl font-bold text-rose-700">
            {formatPrice(priceCalc.estimatedPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
