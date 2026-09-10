import React from 'react';
import { Order } from '../../types/database.types';
import { formatPrice, formatDate, getOrderStatusBadge } from '../../lib/utils';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';

export interface OrderCardProps {
  order: Order;
  role?: 'customer' | 'staff' | 'admin';
  onPriceConfirm?: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, role = 'customer', onPriceConfirm }) => {
  const detailLink = role === 'staff'
    ? `/staff/orders/${order.id}`
    : role === 'admin'
    ? `/admin/orders`
    : `/customer/orders/${order.id}`;

  const isAwaitingConfirmation = order.order_status === 'PRICE_CONFIRMATION' && !order.customer_confirmed_price;

  return (
    <div className="rounded-2xl bg-white/95 border border-cream-200/90 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-200 backdrop-blur-xs flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
      {/* Visual & Info */}
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 rounded-xl overflow-hidden bg-cream-100 border border-cream-200 shrink-0 shadow-inner flex items-center justify-center">
          {order.design?.ai_preview_url || order.design?.reference_image_url ? (
            <img
              src={order.design.ai_preview_url || order.design.reference_image_url}
              alt={order.design?.name || 'Cake'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-2xl">🎂</div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-chocolate-500">
              #{order.order_number}
            </span>
            <StatusBadge status={order.order_status} />
          </div>

          <h4 className="font-serif text-base font-bold text-chocolate-950 mt-1 line-clamp-1">
            {order.design?.name || 'Custom Artisan Cake'}
          </h4>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1.5 text-xs text-chocolate-600">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-rose-600" /> {formatDate(order.requested_date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-rose-600" /> {order.requested_time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-rose-600" /> {order.order_type}
            </span>
          </div>
        </div>
      </div>

      {/* Price & Actions */}
      <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-cream-200 shrink-0">
        <div className="text-left md:text-right">
          <span className="text-[10px] uppercase font-bold text-chocolate-500 block">
            {order.final_price ? 'Confirmed Price' : 'Estimated Price'}
          </span>
          <span className="font-serif text-xl font-bold text-rose-700">
            {formatPrice(order.final_price || order.estimated_price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {role === 'customer' && isAwaitingConfirmation && onPriceConfirm && (
            <Button
              size="sm"
              variant="gold"
              onClick={() => onPriceConfirm(order)}
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            >
              Confirm Price
            </Button>
          )}

          <Link to={detailLink}>
            <Button size="sm" variant={isAwaitingConfirmation ? 'outline' : 'primary'} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
