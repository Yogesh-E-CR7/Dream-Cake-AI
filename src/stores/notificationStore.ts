import { create } from 'zustand';
import { NotificationItem } from '../types/database.types';
import { NotificationService } from '../services/notification.service';

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  loadNotifications: (userId: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  loadNotifications: async (userId: string) => {
    set({ isLoading: true });
    try {
      const items = await NotificationService.getNotifications(userId);
      const unreadCount = items.filter((n) => !n.read).length;
      set({ notifications: items, unreadCount, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    await NotificationService.markAsRead(id);
    const notifications = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount });
  },

  markAllAsRead: async (userId: string) => {
    await NotificationService.markAllAsRead(userId);
    const notifications = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications, unreadCount: 0 });
  },
}));
