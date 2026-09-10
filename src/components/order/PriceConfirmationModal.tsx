import React from 'react';
import { Order } from '../../types/database.types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { Tag, Check, AlertCircle, ShieldCheck } from 'lucide-react';

export interface PriceConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: () => void;
  isConfirming?: boolean;
}

export const PriceConfirmationModal: React.FC<PriceConfirmationModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirm,
  isConfirming = false,
}) => {
  if (!order) return null;

  const estimated = order.estimated_price || 0;
  const finalPrice = order.final_price || order.estimated_price;
  const diff = finalPrice - estimated;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-600 to-burgundy-700 text-white">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-chocolate-950">Bakery Final Price Quote</h3>
            <p className="text-xs text-chocolate-600">Review and accept to confirm your cake order</p>
          </div>
        </div>
      }
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="rounded-2xl bg-cream-50 border border-cream-300 p-4 space-y-3">
          <div className="flex items-center justify-between text-chocolate-700">
            <span>Estimated Initial Price</span>
            <span className="font-semibold text-chocolate-900">{formatPrice(estimated)}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-cream-200">
            <div>
              <span className="font-bold text-chocolate-950 text-sm block">Confirmed Bakery Price</span>
              <span className="text-[10px] text-chocolate-500">Includes artisan craft, custom sculpting & freshness guarantee</span>
            </div>
            <span className="font-serif text-2xl font-bold text-rose-700">
              {formatPrice(finalPrice)}
            </span>
          </div>

          {diff !== 0 && (
            <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-700" />
              <span>
                {diff > 0
                  ? `Adjusted by +${formatPrice(diff)} following master chef assessment of tier geometry and delicate flower piping.`
                  : `Discounted by ${formatPrice(Math.abs(diff))} by bakery.`}
              </span>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-[11px] text-emerald-900 flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
          <div>
            <span className="font-bold block">100% Quality & Timeliness Guarantee</span>
            <span>Once confirmed, your cake is reserved in our oven schedule and handcrafted fresh on your requested delivery date.</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-cream-200">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isConfirming}>
            Review Later
          </Button>
          <Button
            type="button"
            variant="gold"
            size="md"
            onClick={onConfirm}
            isLoading={isConfirming}
            leftIcon={<Check className="h-4 w-4" />}
          >
            Confirm Price & Order
          </Button>
        </div>
      </div>
    </Modal>
  );
};
