import React, { useEffect, useState } from 'react';
import { AdminService, AdminAnalytics } from '../../services/admin.service';
import { formatPrice } from '../../lib/utils';
import {
  Users,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Cake,
  FolderTree,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AdminService.getAnalytics().then((data) => {
      setAnalytics(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !analytics) {
    return <div className="p-12 text-center text-xs text-chocolate-500">Loading business analytics...</div>;
  }

  const kpis = [
    { label: 'Total Revenue', value: formatPrice(analytics.totalRevenue), icon: DollarSign, color: 'text-emerald-700 bg-emerald-100' },
    { label: 'Total Orders', value: analytics.totalOrders, icon: ShoppingBag, color: 'text-rose-700 bg-rose-100' },
    { label: 'Avg Order Value', value: formatPrice(analytics.averageOrderValue), icon: TrendingUp, color: 'text-purple-700 bg-purple-100' },
    { label: 'Registered Customers', value: analytics.totalCustomers, icon: Users, color: 'text-blue-700 bg-blue-100' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
          Executive Bakery Analytics
        </h2>
        <p className="text-xs text-chocolate-600 mt-1">
          Real-time performance, revenue overview, flavor popularity, and demand trends
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl bg-white border border-cream-200/90 p-5 shadow-soft flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-chocolate-500">
                  {kpi.label}
                </span>
                <span className="font-serif text-2xl font-bold text-chocolate-950 mt-1 block">
                  {kpi.value}
                </span>
              </div>
              <div className={`h-12 w-12 rounded-2xl ${kpi.color} flex items-center justify-center shrink-0 shadow-2xs`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Revenue & Volume Chart */}
      <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div>
            <h3 className="font-serif text-lg font-bold text-chocolate-950">
              Weekly Revenue & Order Volume
            </h3>
            <p className="text-xs text-chocolate-600">Past 7 days performance metrics</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            +28.4% this week
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-7 gap-3 pt-6 items-end h-56">
          {analytics.ordersOverTime.map((day, idx) => {
            const heightPercent = Math.round((day.revenue / 40000) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-chocolate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatPrice(day.revenue)}
                </span>
                <div
                  className="w-full rounded-2xl bg-gradient-to-t from-rose-700 to-rose-400 group-hover:from-rose-800 group-hover:to-gold-400 transition-all shadow-soft"
                  style={{ height: `${Math.max(heightPercent, 15)}%` }}
                />
                <span className="text-xs font-bold text-chocolate-800">{day.date}</span>
                <span className="text-[10px] text-chocolate-500 font-medium">{day.count} orders</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Analytics: Flavors & Occasions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Flavors */}
        <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-chocolate-950 flex items-center gap-2">
            <Cake className="h-5 w-5 text-rose-700" /> Most Popular Gourmet Flavors
          </h3>
          <div className="space-y-3">
            {analytics.popularFlavors.slice(0, 5).map((flv, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-chocolate-900">
                  <span>{flv.name}</span>
                  <span className="text-rose-700">{flv.count} designs ({flv.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-cream-100 overflow-hidden">
                  <div
                    className="h-full bg-rose-600 rounded-full"
                    style={{ width: `${Math.max(flv.percentage, 10)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Occasion Distribution */}
        <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-chocolate-950 flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-purple-700" /> Milestone Occasion Demand
          </h3>
          <div className="space-y-3">
            {analytics.popularOccasions.slice(0, 5).map((occ, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-chocolate-900">
                  <span>{occ.name}</span>
                  <span className="text-purple-700">{occ.count} designs ({occ.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-cream-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${Math.max(occ.percentage, 10)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
