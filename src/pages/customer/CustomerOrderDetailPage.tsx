import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatusHistory } from '../../types/database.types';
import { OrderTimeline } from '../../components/order/OrderTimeline';
import { PriceConfirmationModal } from '../../components/order/PriceConfirmationModal';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatPrice, formatDate } from '../../lib/utils';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Tag,
  Check,
  ChefHat,
} from 'lucide-react';

export const CustomerOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<OrderStatusHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const loadOrderData = async () => {
    if (!id) return;
    const ord = await OrderService.getOrderById(id);
    if (ord) {
      const hist = await OrderService.getStatusHistory(ord.id);
      setOrder(ord);
      setHistory(hist);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrderData();
  }, [id]);

  const handleConfirmPrice = async () => {
    if (!order || !user) return;
    setIsConfirming(true);
    try {
      await OrderService.confirmCustomerPrice(order.id, user.id);
      setIsConfirming(false);
      setIsConfirmModalOpen(false);
      loadOrderData();
    } catch (e) {
      setIsConfirming(false);
    }
  };

  if (isLoading || !order) {
    return <div className="p-12 text-center text-xs text-chocolate-500">Loading order details...</div>;
  }

  const isAwaitingPriceConfirmation = order.order_status === 'PRICE_CONFIRMATION' && !order.customer_confirmed_price;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/customer/orders')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-chocolate-600 hover:text-rose-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Orders
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-chocolate-500">
            Order #{order.order_number}
          </span>
          <StatusBadge status={order.order_status} />
        </div>
      </div>

      {/* Action Banner if Price confirmation needed */}
      {isAwaitingPriceConfirmation && (
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white p-6 shadow-soft-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-gold-300 tracking-wider flex items-center gap-1">
              <Tag className="h-4 w-4" /> Final Bakery Price Ready
            </span>
            <h3 className="font-serif text-lg font-bold text-white mt-1">
              The bakery has quoted {formatPrice(order.final_price)} for your design.
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Confirm this price to lock in your order and start baking!
            </p>
          </div>

          <Button
            type="button"
            variant="gold"
            size="md"
            onClick={() => setIsConfirmModalOpen(true)}
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            Review & Confirm Price
          </Button>
        </div>
      )}

      {/* 2-Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cake Card & Specifications (Cols: 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-5">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 flex items-center justify-center">
              {order.design?.ai_preview_url || order.design?.reference_image_url ? (
                <img
                  src={order.design.ai_preview_url || order.design.reference_image_url}
                  alt={order.design?.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-6xl">🎂</div>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                {order.design?.occasion}
              </span>
              <h3 className="font-serif text-xl font-bold text-chocolate-950 mt-1">
                {order.design?.name}
              </h3>
              <p className="text-xs text-chocolate-600 mt-0.5">
                {order.design?.shape} • {order.design?.tiers} {order.design?.tiers === 1 ? 'Tier' : 'Tiers'}
              </p>
            </div>

            {/* Price Details */}
            <div className="rounded-2xl bg-cream-50 p-4 border border-cream-200 space-y-2 text-xs">
              <div className="flex justify-between items-center text-chocolate-700">
                <span>Estimated Price:</span>
                <span className="font-semibold">{formatPrice(order.estimated_price)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-cream-200 text-chocolate-950 font-bold">
                <span>Final Bakery Price:</span>
                <span className="font-serif text-xl text-rose-700">
                  {formatPrice(order.final_price || order.estimated_price)}
                </span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="rounded-2xl bg-cream-50/50 p-4 border border-cream-200 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-chocolate-500 block">Fulfillment Details</span>
              <div className="flex items-center gap-2 text-chocolate-800">
                <Calendar className="h-4 w-4 text-rose-600" />
                <span>Requested: {formatDate(order.requested_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-chocolate-800">
                <Clock className="h-4 w-4 text-rose-600" />
                <span>Time Slot: {order.requested_time}</span>
              </div>
              <div className="flex items-center gap-2 text-chocolate-800">
                <MapPin className="h-4 w-4 text-rose-600" />
                <span>Type: {order.order_type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive 10-step Timeline & Status History (Cols: 7) */}
        <div className="lg:col-span-7 rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-cream-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-chocolate-950">
                Live Preparation Timeline
              </h3>
              <p className="text-xs text-chocolate-600 mt-0.5">
                Real-time tracking directly synced with the bakery kitchen
              </p>
            </div>
          </div>

          <OrderTimeline currentStatus={order.order_status} history={history} />
        </div>
      </div>

      {/* Confirmation Modal */}
      <PriceConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        order={order}
        onConfirm={handleConfirmPrice}
        isConfirming={isConfirming}
      />
    </div>
  );
};
