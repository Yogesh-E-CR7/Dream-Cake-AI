import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
}

export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
}

export function getOrderStatusBadge(status: string) {
  switch (status) {
    case 'PENDING_REVIEW':
      return { label: 'Pending Bakery Review', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'PRICE_CONFIRMATION':
      return { label: 'Price Quote Ready', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    case 'CONFIRMED':
      return { label: 'Order Confirmed', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case 'PREPARING':
      return { label: 'Baking in Progress', color: 'bg-purple-100 text-purple-800 border-purple-300' };
    case 'DECORATING':
      return { label: 'Artisan Decorating', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    case 'QUALITY_CHECK':
      return { label: 'Chef Quality Check', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    case 'READY':
      return { label: 'Ready for Pickup / Dispatch', color: 'bg-teal-100 text-teal-800 border-teal-300' };
    case 'OUT_FOR_DELIVERY':
      return { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    case 'COMPLETED':
      return { label: 'Delivered & Completed', color: 'bg-green-100 text-green-800 border-green-300' };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-300' };
    default:
      return { label: status, color: 'bg-stone-100 text-stone-800 border-stone-300' };
  }
}
