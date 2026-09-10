import { NotificationItem } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localDb } from '../lib/storage';

export class NotificationService {
  static async getNotifications(userId: string): Promise<NotificationItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase fetch notifications failed:', e);
      }
    }
    return localDb.getNotifications(userId);
  }

  static async send(params: {
    user_id: string;
    title: string;
    message: string;
    type?: string;
    order_id?: string;
  }): Promise<NotificationItem> {
    const item: Omit<NotificationItem, 'id' | 'created_at'> = {
      user_id: params.user_id,
      title: params.title,
      message: params.message,
      type: params.type || 'INFO',
      order_id: params.order_id,
      read: false,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('notifications').insert(item).select().single();
        if (data) return data;
      } catch (e) {
        console.warn('Supabase insert notification failed:', e);
      }
    }

    return localDb.addNotification(item);
  }

  static async markAsRead(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
      } catch (e) {
        console.warn('Supabase update notification failed:', e);
      }
    }
    localDb.markNotificationAsRead(id);
  }

  static async markAllAsRead(userId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
      } catch (e) {
        console.warn('Supabase mark all read failed:', e);
      }
    }
    localDb.markAllNotificationsAsRead(userId);
  }
}
