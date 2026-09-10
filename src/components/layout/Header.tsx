import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { formatDateTime } from '../../lib/utils';
import {
  Bell,
  LogOut,
  User,
  ShieldCheck,
  ChefHat,
  Sparkles,
  ChevronDown,
  Check,
  Cake,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { user, signOut, switchDemoRole } = useAuthStore();
  const { notifications, unreadCount, loadNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadNotifications(user.id);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleRoleSwitch = async (role: 'customer' | 'staff' | 'admin') => {
    await switchDemoRole(role);
    setIsRoleDropdownOpen(false);
    if (role === 'customer') navigate('/customer/home');
    else if (role === 'staff') navigate('/staff/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cream-200/80 bg-[#FFFDF9]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to={user?.role === 'staff' ? '/staff/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/customer/home'} className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-burgundy-800 text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-gold-300" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-chocolate-950 block leading-tight">
              Dream Cake <span className="text-rose-600">AI</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-chocolate-500 font-semibold block">
              Artisan Design Studio
            </span>
          </div>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Demo Role Switcher Quick Pill */}
          <div className="relative" ref={roleRef}>
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 rounded-full bg-cream-100 border border-cream-300 px-3 py-1 text-xs font-semibold text-chocolate-800 hover:bg-cream-200 transition-colors shadow-2xs"
            >
              {user?.role === 'admin' ? (
                <ShieldCheck className="h-3.5 w-3.5 text-purple-700" />
              ) : user?.role === 'staff' ? (
                <ChefHat className="h-3.5 w-3.5 text-rose-700" />
              ) : (
                <User className="h-3.5 w-3.5 text-emerald-700" />
              )}
              <span className="capitalize">{user?.role || 'Guest'}</span>
              <ChevronDown className="h-3 w-3 text-chocolate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-cream-200 p-2 shadow-soft-xl animate-fade-in z-50 text-xs">
                <span className="px-2 py-1 text-[10px] font-bold uppercase text-chocolate-400 block">
                  Quick Switch Role (Demo)
                </span>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('customer')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    user?.role === 'customer' ? 'bg-rose-50 text-rose-900 font-bold' : 'hover:bg-cream-100 text-chocolate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-600" /> Customer Portal
                  </span>
                  {user?.role === 'customer' && <Check className="h-3.5 w-3.5 text-rose-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSwitch('staff')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    user?.role === 'staff' ? 'bg-rose-50 text-rose-900 font-bold' : 'hover:bg-cream-100 text-chocolate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-rose-600" /> Bakery Staff Portal
                  </span>
                  {user?.role === 'staff' && <Check className="h-3.5 w-3.5 text-rose-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSwitch('admin')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    user?.role === 'admin' ? 'bg-rose-50 text-rose-900 font-bold' : 'hover:bg-cream-100 text-chocolate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-purple-600" /> Admin Console
                  </span>
                  {user?.role === 'admin' && <Check className="h-3.5 w-3.5 text-rose-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative rounded-full p-2 text-chocolate-600 hover:bg-cream-100 hover:text-chocolate-900 transition-colors"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-cream-200 shadow-soft-xl animate-fade-in z-50 overflow-hidden">
                <div className="flex items-center justify-between p-3.5 bg-cream-50 border-b border-cream-200">
                  <span className="font-serif font-bold text-sm text-chocolate-950">Notifications</span>
                  {unreadCount > 0 && user && (
                    <button
                      type="button"
                      onClick={() => markAllAsRead(user.id)}
                      className="text-[11px] font-semibold text-rose-700 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-cream-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-chocolate-500">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          if (n.order_id) {
                            setIsNotifOpen(false);
                            navigate(user?.role === 'staff' ? `/staff/orders/${n.order_id}` : `/customer/orders/${n.order_id}`);
                          }
                        }}
                        className={`p-3.5 hover:bg-cream-50/80 transition-colors cursor-pointer text-xs ${
                          !n.read ? 'bg-rose-50/40 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-chocolate-950">{n.title}</span>
                          <span className="text-[10px] text-chocolate-400 font-mono">
                            {formatDateTime(n.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 text-chocolate-600 leading-relaxed text-[11px]">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Sign Out */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-cream-200">
              <Link to="/customer/profile">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                  alt={user.full_name}
                  className="h-8 w-8 rounded-full border border-rose-300 object-cover"
                  title={user.full_name}
                />
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-lg p-2 text-chocolate-500 hover:bg-cream-100 hover:text-rose-700 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
