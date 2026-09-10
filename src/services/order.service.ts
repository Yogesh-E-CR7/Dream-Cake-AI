import { Order, OrderStatus, OrderType, OrderStatusHistory, OrderNote } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localDb } from '../lib/storage';
import { NotificationService } from './notification.service';

export class OrderService {
  static async getOrders(userId?: string): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('orders')
          .select('*, design:cake_designs(*), customer:profiles!orders_user_id_fkey(*), assigned_staff:profiles!orders_assigned_staff_id_fkey(*), delivery_address:addresses(*)')
          .order('created_at', { ascending: false });
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase fetch orders failed:', e);
      }
    }
    const orders = localDb.getOrders(userId);
    // Enrich joins
    return orders.map((o) => {
      const design = localDb.getDesignById(o.design_id) || o.design;
      const customer = localDb.getProfiles().find((p) => p.id === o.user_id) || o.customer;
      const assigned_staff = o.assigned_staff_id ? localDb.getProfiles().find((p) => p.id === o.assigned_staff_id) : o.assigned_staff;
      const delivery_address = o.delivery_address_id ? localDb.getAddresses(o.user_id).find((a) => a.id === o.delivery_address_id) : o.delivery_address;
      return { ...o, design: design || undefined, customer, assigned_staff, delivery_address };
    });
  }

  static async getOrderById(id: string): Promise<Order | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, design:cake_designs(*), customer:profiles!orders_user_id_fkey(*), assigned_staff:profiles!orders_assigned_staff_id_fkey(*), delivery_address:addresses(*)')
          .or(`id.eq.${id},order_number.eq.${id}`)
          .maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase fetch single order failed:', e);
      }
    }
    const orders = await this.getOrders();
    const found = orders.find((o) => o.id === id || o.order_number === id);
    if (found) return found;

    const direct = localDb.getOrderById(id);
    if (direct) {
      const design = localDb.getDesignById(direct.design_id) || direct.design;
      const customer = localDb.getProfiles().find((p) => p.id === direct.user_id) || direct.customer;
      const assigned_staff = direct.assigned_staff_id ? localDb.getProfiles().find((p) => p.id === direct.assigned_staff_id) : direct.assigned_staff;
      const delivery_address = direct.delivery_address_id ? localDb.getAddresses(direct.user_id).find((a) => a.id === direct.delivery_address_id) : direct.delivery_address;
      return { ...direct, design: design || undefined, customer, assigned_staff, delivery_address };
    }
    return null;
  }

  static async createOrder(params: {
    user_id: string;
    design_id: string;
    order_type: OrderType;
    delivery_address_id?: string;
    requested_date: string;
    requested_time: string;
    customer_notes?: string;
    estimated_price: number;
  }): Promise<Order> {
    const orderNumber = `DC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      user_id: params.user_id,
      design_id: params.design_id,
      order_type: params.order_type,
      delivery_address_id: params.delivery_address_id,
      requested_date: params.requested_date,
      requested_time: params.requested_time,
      customer_notes: params.customer_notes,
      estimated_price: params.estimated_price,
      customer_confirmed_price: false,
      payment_status: 'PENDING',
      order_status: 'PENDING_REVIEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').insert(newOrder).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase create order failed:', e);
      }
    }

    const saved = localDb.saveOrder(newOrder);

    // Add Initial Status History
    localDb.addStatusHistory({
      order_id: saved.id,
      status: 'PENDING_REVIEW',
      message: 'Cake request submitted by customer. Awaiting bakery feasibility and price review.',
      updated_by: params.user_id,
      updater_name: 'Customer',
    });

    // Notify Customer
    NotificationService.send({
      user_id: params.user_id,
      title: 'Order Request Received 🎂',
      message: `Your request for order #${saved.order_number} has been sent to our master bakers for review.`,
      type: 'ORDER_SUBMITTED',
      order_id: saved.id,
    });

    return saved;
  }

  static async setStaffQuote(params: {
    order_id: string;
    staff_id: string;
    staff_name: string;
    final_price: number;
    notes?: string;
  }): Promise<Order | null> {
    const order = await this.getOrderById(params.order_id);
    if (!order) return null;

    const updated: Order = {
      ...order,
      assigned_staff_id: params.staff_id,
      final_price: params.final_price,
      order_status: 'PRICE_CONFIRMATION',
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            assigned_staff_id: params.staff_id,
            final_price: params.final_price,
            order_status: 'PRICE_CONFIRMATION',
            updated_at: updated.updated_at,
          })
          .eq('id', params.order_id);
      } catch (e) {
        console.warn('Supabase set quote failed:', e);
      }
    }

    localDb.saveOrder(updated);

    localDb.addStatusHistory({
      order_id: params.order_id,
      status: 'PRICE_CONFIRMATION',
      message: `Bakery reviewed design complexity and finalized price to ₹${params.final_price.toLocaleString('en-IN')}. Awaiting your confirmation.`,
      updated_by: params.staff_id,
      updater_name: params.staff_name,
    });

    if (params.notes) {
      localDb.addOrderNote({
        order_id: params.order_id,
        author_id: params.staff_id,
        author_name: params.staff_name,
        note: params.notes,
        internal: true,
      });
    }

    NotificationService.send({
      user_id: order.user_id,
      title: 'Final Price Ready for Confirmation 🏷️',
      message: `The bakery has reviewed your order #${order.order_number} and quoted ₹${params.final_price.toLocaleString('en-IN')}. Please confirm to start baking!`,
      type: 'PRICE_CONFIRMATION',
      order_id: params.order_id,
    });

    return updated;
  }

  static async confirmCustomerPrice(order_id: string, user_id: string): Promise<Order | null> {
    const order = await this.getOrderById(order_id);
    if (!order) return null;

    const updated: Order = {
      ...order,
      customer_confirmed_price: true,
      order_status: 'CONFIRMED',
      payment_status: 'PAID', // In mock/development mode
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            customer_confirmed_price: true,
            order_status: 'CONFIRMED',
            payment_status: 'PAID',
            updated_at: updated.updated_at,
          })
          .eq('id', order_id);
      } catch (e) {
        console.warn('Supabase confirm price failed:', e);
      }
    }

    localDb.saveOrder(updated);

    localDb.addStatusHistory({
      order_id,
      status: 'CONFIRMED',
      message: 'Customer confirmed final price. Order locked into baking queue.',
      updated_by: user_id,
      updater_name: 'Customer',
    });

    NotificationService.send({
      user_id: order.user_id,
      title: 'Order Confirmed! 🎉',
      message: `Your order #${order.order_number} is officially confirmed and queued for preparation!`,
      type: 'ORDER_CONFIRMED',
      order_id,
    });

    return updated;
  }

  static async updateStatus(params: {
    order_id: string;
    staff_id: string;
    staff_name: string;
    status: OrderStatus;
    customMessage?: string;
  }): Promise<Order | null> {
    const order = await this.getOrderById(params.order_id);
    if (!order) return null;

    const defaultMessages: Record<OrderStatus, string> = {
      PENDING_REVIEW: 'Awaiting bakery review.',
      PRICE_CONFIRMATION: 'Price quote ready for confirmation.',
      CONFIRMED: 'Order confirmed and scheduled.',
      PREPARING: 'Fresh sponge baking and filling preparation underway in the bakery.',
      DECORATING: 'Master decorators are applying handcrafted icings and decorations.',
      QUALITY_CHECK: 'Head Chef inspecting finish, structural balance, and packaging.',
      READY: 'Your dream cake is finished and boxed with care! Ready for collection / dispatch.',
      OUT_FOR_DELIVERY: 'Your cake has left the kitchen in climate-controlled transport.',
      COMPLETED: 'Delivered successfully! Enjoy your celebration.',
      CANCELLED: 'This order has been cancelled.',
    };

    const updated: Order = {
      ...order,
      order_status: params.status,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            order_status: params.status,
            updated_at: updated.updated_at,
          })
          .eq('id', params.order_id);
      } catch (e) {
        console.warn('Supabase update status failed:', e);
      }
    }

    localDb.saveOrder(updated);

    const message = params.customMessage || defaultMessages[params.status] || `Status updated to ${params.status}`;

    localDb.addStatusHistory({
      order_id: params.order_id,
      status: params.status,
      message,
      updated_by: params.staff_id,
      updater_name: params.staff_name,
    });

    NotificationService.send({
      user_id: order.user_id,
      title: `Order #${order.order_number}: ${params.status.replace(/_/g, ' ')}`,
      message,
      type: 'STATUS_UPDATE',
      order_id: params.order_id,
    });

    return updated;
  }

  static async getStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
    return localDb.getStatusHistory(orderId);
  }

  static async getOrderNotes(orderId: string): Promise<OrderNote[]> {
    return localDb.getOrderNotes(orderId);
  }

  static async addOrderNote(orderId: string, authorId: string, authorName: string, note: string): Promise<OrderNote> {
    return localDb.addOrderNote({
      order_id: orderId,
      author_id: authorId,
      author_name: authorName,
      note,
      internal: true,
    });
  }
}
