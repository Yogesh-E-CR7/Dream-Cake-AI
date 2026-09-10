import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/database.types';
import { OrderCard } from '../../components/order/OrderCard';
import { PriceConfirmationModal } from '../../components/order/PriceConfirmationModal';
import { EmptyState, LoadingSkeleton } from '../../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Wand2, ShoppingBag, Check } from 'lucide-react';

export const CustomerOrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedOrderForConfirm, setSelectedOrderForConfirm] = useState<Order | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const loadOrders = async () => {
    if (user) {
      const list = await OrderService.getOrders(user.id);
      setOrders(list);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const handleConfirmPrice = async () => {
    if (!selectedOrderForConfirm || !user) return;
    setIsConfirming(true);
    try {
      await OrderService.confirmCustomerPrice(selectedOrderForConfirm.id, user.id);
      setIsConfirming(false);
      setSelectedOrderForConfirm(null);
      loadOrders();
    } catch (e) {
      setIsConfirming(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'active') {
      return !['COMPLETED', 'CANCELLED'].includes(o.order_status);
    }
    if (activeTab === 'completed') {
      return o.order_status === 'COMPLETED';
    }
    return o.order_status === 'CANCELLED';
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
            My Orders
          </h2>
          <p className="text-xs text-chocolate-600 mt-1">
            Track real-time bakery progression from review to doorstep delivery
          </p>
        </div>

        <Link to="/customer/design">
          <Button variant="primary" size="md" leftIcon={<Wand2 className="h-4 w-4" />}>
            Design Another Cake
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-cream-100 p-1 border border-cream-200 w-full sm:w-80">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-white text-rose-700 shadow-xs'
              : 'text-chocolate-600 hover:text-chocolate-950'
          }`}
        >
          Active Orders
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            activeTab === 'completed'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-chocolate-600 hover:text-chocolate-950'
          }`}
        >
          Completed
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            activeTab === 'cancelled'
              ? 'bg-white text-red-700 shadow-xs'
              : 'text-chocolate-600 hover:text-chocolate-950'
          }`}
        >
          Cancelled
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} orders`}
          description={
            activeTab === 'active'
              ? 'You do not have any active cake orders in progress.'
              : 'No past orders in this category.'
          }
          actionLabel="Create a Cake"
          onAction={() => (window.location.href = '/customer/design')}
          actionIcon={<Wand2 className="h-4 w-4" />}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              role="customer"
              onPriceConfirm={(ord) => setSelectedOrderForConfirm(ord)}
            />
          ))}
        </div>
      )}

      {/* Price Confirmation Modal */}
      <PriceConfirmationModal
        isOpen={Boolean(selectedOrderForConfirm)}
        onClose={() => setSelectedOrderForConfirm(null)}
        order={selectedOrderForConfirm}
        onConfirm={handleConfirmPrice}
        isConfirming={isConfirming}
      />
    </div>
  );
};
