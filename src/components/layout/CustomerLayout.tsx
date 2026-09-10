import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Header } from './Header';
import {
  Home,
  Wand2,
  FolderHeart,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/customer/home', label: 'Home', icon: Home },
    { to: '/customer/design', label: 'Design Cake', icon: Wand2, highlight: true },
    { to: '/customer/designs', label: 'My Designs', icon: FolderHeart },
    { to: '/customer/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/customer/favorites', label: 'Favorites', icon: Heart },
    { to: '/customer/addresses', label: 'Addresses', icon: MapPin },
    { to: '/customer/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Header />

      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex w-60 flex-col gap-1 shrink-0">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-950 to-burgundy-950 text-white mb-4 shadow-soft">
            <span className="flex items-center gap-1.5 text-xs font-bold text-gold-300 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> AI Cake Studio
            </span>
            <p className="text-xs text-rose-100/80 mt-1 leading-relaxed">
              Design bespoke cakes with AI-powered suggestions and live 3D concepts.
            </p>
          </div>

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
                      : item.highlight
                      ? 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
                      : 'text-chocolate-700 hover:bg-cream-100 hover:text-chocolate-950'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${item.highlight && !isActive ? 'text-rose-600' : ''}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Main View Area */}
        <main className="flex-1 pb-20 md:pb-6 overflow-hidden min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation (5 items) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-cream-200 shadow-soft-xl px-2 py-2 flex items-center justify-around">
        {[
          { to: '/customer/home', label: 'Home', icon: Home },
          { to: '/customer/design', label: 'Design', icon: Wand2 },
          { to: '/customer/designs', label: 'Designs', icon: FolderHeart },
          { to: '/customer/orders', label: 'Orders', icon: ShoppingBag },
          { to: '/customer/profile', label: 'Profile', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center p-1.5 min-w-[54px] rounded-xl text-[10px] font-semibold transition-colors ${
                isActive ? 'text-rose-700 font-bold' : 'text-chocolate-500 hover:text-chocolate-900'
              }`}
            >
              <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
