import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../types/database.types';
import { OrderCard } from '../../components/order/OrderCard';
import { Input } from '../../components/ui/Input';
import { Search, Filter, ChefHat } from 'lucide-react';

export const StaffOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    const list = await OrderService.getOrders();
    setOrders(list);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.design?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.order_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statuses: { label: string; value: string }[] = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'New Review', value: 'PENDING_REVIEW' },
    { label: 'Quotes Pending', value: 'PRICE_CONFIRMATION' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Baking (Prep)', value: 'PREPARING' },
    { label: 'Decorating', value: 'DECORATING' },
    { label: 'Quality Check', value: 'QUALITY_CHECK' },
    { label: 'Ready', value: 'READY' },
    { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
          Order Processing Queue
        </h2>
        <p className="text-xs text-chocolate-600 mt-1">
          Review specifications, approve feasibility, quote prices, and advance production
        </p>
      </div>

      {/* Filters Bar */}
      <div className="rounded-3xl bg-white/95 border border-cream-200 p-4 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by order #, customer name, cake style..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Horizontal Status Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statuses.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                statusFilter === s.value
                  ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                  : 'bg-cream-50 text-chocolate-700 border-cream-200 hover:bg-cream-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-cream-200 text-xs text-chocolate-500">
            No orders found matching your search criteria.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} role="staff" />
          ))
        )}
      </div>
    </div>
  );
};
