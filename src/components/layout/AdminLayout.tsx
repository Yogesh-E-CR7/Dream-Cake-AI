import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Header } from './Header';
import {
  LayoutDashboard,
  FolderTree,
  Cake,
  Sparkles,
  Scale,
  Palette,
  DollarSign,
  Users,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/admin/dashboard', label: 'Analytics & Revenue', icon: LayoutDashboard },
    { to: '/admin/orders', label: 'Orders Oversight', icon: ShoppingBag },
    { to: '/admin/categories', label: 'Cake Categories', icon: FolderTree },
    { to: '/admin/flavors', label: 'Gourmet Flavors', icon: Cake },
    { to: '/admin/frostings', label: 'Frostings & Icings', icon: Sparkles },
    { to: '/admin/sizes', label: 'Sizes & Servings', icon: Scale },
    { to: '/admin/decorations', label: 'Decorations & Toppers', icon: Palette },
    { to: '/admin/pricing', label: 'Dynamic Pricing Engine', icon: DollarSign },
    { to: '/admin/users', label: 'User & Staff Roles', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Header />

      <div className="bg-purple-950 text-white py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-gold-400" />
        <span>Executive Management & System Administration Console</span>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex w-64 flex-col gap-1 shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-800 text-white shadow-sm'
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
