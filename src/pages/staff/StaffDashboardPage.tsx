import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/database.types';
import { formatPrice, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ChefHat,
  Clock,
  CheckCircle,
  Tag,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const StaffDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    const list = await OrderService.getOrders();
    setOrders(list);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const newRequests = orders.filter((o) => o.order_status === 'PENDING_REVIEW');
  const pendingQuotes = orders.filter((o) => o.order_status === 'PRICE_CONFIRMATION');
  const preparing = orders.filter((o) => o.order_status === 'PREPARING');
  const decorating = orders.filter((o) => o.order_status === 'DECORATING');
  const qualityCheck = orders.filter((o) => o.order_status === 'QUALITY_CHECK');
  const ready = orders.filter((o) => o.order_status === 'READY');

  const stats = [
    { label: 'New Requests', count: newRequests.length, icon: Clock, color: 'bg-amber-500' },
    { label: 'Quotes Pending', count: pendingQuotes.length, icon: Tag, color: 'bg-blue-500' },
    { label: 'Baking in Oven', count: preparing.length, icon: ChefHat, color: 'bg-purple-500' },
    { label: 'Artisan Decorating', count: decorating.length, icon: Sparkles, color: 'bg-rose-500' },
    { label: 'Quality Check', count: qualityCheck.length, icon: ShieldCheck, color: 'bg-indigo-500' },
    { label: 'Ready for Dispatch', count: ready.length, icon: PackageCheck, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
            Kitchen Operations Board
          </h2>
          <p className="text-xs text-chocolate-600 mt-1">
            Live workstation queue for master bakers and cake decorators
          </p>
        </div>

        <Link to="/staff/orders">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
            View All Orders Queue ({orders.length})
          </Button>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-cream-200 p-4 shadow-soft flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-chocolate-600 line-clamp-1">{stat.label}</span>
                <div className={`h-6 w-6 rounded-lg ${stat.color} text-white flex items-center justify-center shrink-0`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <span className="font-serif text-2xl font-bold text-chocolate-950 mt-2 block">
                {stat.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Immediate Review Queue (Orders Needing Price Quote or Action) */}
      <div className="rounded-3xl bg-white/95 border border-cream-200 p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div>
            <h3 className="font-serif text-lg font-bold text-chocolate-950">
              High-Priority Review Queue
            </h3>
            <p className="text-xs text-chocolate-600">
              Orders requiring chef evaluation, quote confirmation, or kitchen dispatch
            </p>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            {newRequests.length + preparing.length} Active
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-xs text-chocolate-500">
            No orders in kitchen queue at this moment.
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-cream-100 border border-cream-200 shrink-0">
                    {order.design?.ai_preview_url || order.design?.reference_image_url ? (
                      <img
                        src={order.design.ai_preview_url || order.design.reference_image_url}
                        alt="Cake"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-2xl">🎂</div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-chocolate-600">#{order.order_number}</span>
                      <StatusBadge status={order.order_status} />
                    </div>
                    <h4 className="font-serif font-bold text-chocolate-950 text-sm mt-0.5">
                      {order.design?.name || 'Artisan Custom Cake'}
                    </h4>
                    <p className="text-xs text-chocolate-500">
                      Customer: {order.customer?.full_name || 'Guest'} • For {formatDate(order.requested_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-chocolate-500 block">
                      {order.final_price ? 'Confirmed Price' : 'Estimated Price'}
                    </span>
                    <span className="font-serif font-bold text-base text-rose-700">
                      {formatPrice(order.final_price || order.estimated_price)}
                    </span>
                  </div>

                  <Link to={`/staff/orders/${order.id}`}>
                    <Button size="sm" variant="gold" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                      Process Order
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
