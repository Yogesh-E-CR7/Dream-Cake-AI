import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { ChefHat, ClipboardList, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const StaffLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/staff/dashboard', label: 'Kitchen Dashboard', icon: ChefHat },
    { to: '/staff/orders', label: 'Order Processing Queue', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Header />

      <div className="bg-rose-950 text-white py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <ChefHat className="h-4 w-4 text-gold-400" />
        <span>Bakery Master Kitchen & Operations Station</span>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex w-60 flex-col gap-1 shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-700 text-white shadow-sm shadow-rose-200'
                      : 'text-chocolate-700 hover:bg-cream-100 hover:text-chocolate-950'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Main View */}
        <main className="flex-1 pb-12 overflow-hidden min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
