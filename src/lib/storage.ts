import {
  Profile,
  CakeDesign,
  Order,
  NotificationItem,
  CakeCategory,
  CakeFlavor,
  Frosting,
  CakeSize,
  Decoration,
  Address,
  OrderStatusHistory,
  OrderNote,
} from '../types/database.types';
import {
  MOCK_CATEGORIES,
  MOCK_FLAVORS,
  MOCK_FROSTINGS,
  MOCK_SIZES,
  MOCK_DECORATIONS,
  DEMO_PROFILES,
  INITIAL_DESIGNS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'dream_cake_user',
  PROFILES: 'dream_cake_profiles',
  CATEGORIES: 'dream_cake_categories',
  FLAVORS: 'dream_cake_flavors',
  FROSTINGS: 'dream_cake_frostings',
  SIZES: 'dream_cake_sizes',
  DECORATIONS: 'dream_cake_decorations',
  DESIGNS: 'dream_cake_designs',
  ORDERS: 'dream_cake_orders',
  NOTIFICATIONS: 'dream_cake_notifications',
  ADDRESSES: 'dream_cake_addresses',
  STATUS_HISTORY: 'dream_cake_status_history',
  ORDER_NOTES: 'dream_cake_order_notes',
};

class LocalStorageDB {
  private getItem<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  private setItem<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this.setItem(STORAGE_KEYS.CATEGORIES, MOCK_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FLAVORS)) {
      this.setItem(STORAGE_KEYS.FLAVORS, MOCK_FLAVORS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FROSTINGS)) {
      this.setItem(STORAGE_KEYS.FROSTINGS, MOCK_FROSTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SIZES)) {
      this.setItem(STORAGE_KEYS.SIZES, MOCK_SIZES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DECORATIONS)) {
      this.setItem(STORAGE_KEYS.DECORATIONS, MOCK_DECORATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
      this.setItem(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DESIGNS)) {
      this.setItem(STORAGE_KEYS.DESIGNS, INITIAL_DESIGNS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this.setItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADDRESSES)) {
      this.setItem(STORAGE_KEYS.ADDRESSES, [
        {
          id: 'addr-1',
          user_id: 'usr-customer-1',
          label: 'Home',
          full_name: 'Ananya Sharma',
          phone: '+91 98765 43210',
          address_line_1: 'Villa 14, Lotus Palms Residency',
          address_line_2: 'Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postal_code: '560038',
          country: 'India',
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    }
  }

  // Auth & Profile
  getCurrentUser(): Profile | null {
    return this.getItem<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: Profile | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  getProfiles(): Profile[] {
    return this.getItem<Profile[]>(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
  }

  saveProfile(profile: Profile): void {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex((p) => p.id === profile.id || p.email === profile.email);
    if (idx >= 0) {
      profiles[idx] = { ...profiles[idx], ...profile, updated_at: new Date().toISOString() };
    } else {
      profiles.push(profile);
    }
    this.setItem(STORAGE_KEYS.PROFILES, profiles);
    if (this.getCurrentUser()?.id === profile.id) {
      this.setCurrentUser(profile);
    }
  }

  // Catalog
  getCategories(): CakeCategory[] {
    return this.getItem<CakeCategory[]>(STORAGE_KEYS.CATEGORIES, MOCK_CATEGORIES);
  }

  saveCategory(category: CakeCategory): void {
    const list = this.getCategories();
    const idx = list.findIndex((c) => c.id === category.id);
    if (idx >= 0) list[idx] = category;
    else list.push(category);
    this.setItem(STORAGE_KEYS.CATEGORIES, list);
  }

  getFlavors(): CakeFlavor[] {
    return this.getItem<CakeFlavor[]>(STORAGE_KEYS.FLAVORS, MOCK_FLAVORS);
  }

  saveFlavor(flavor: CakeFlavor): void {
    const list = this.getFlavors();
    const idx = list.findIndex((f) => f.id === flavor.id);
    if (idx >= 0) list[idx] = flavor;
    else list.push(flavor);
    this.setItem(STORAGE_KEYS.FLAVORS, list);
  }

  getFrostings(): Frosting[] {
    return this.getItem<Frosting[]>(STORAGE_KEYS.FROSTINGS, MOCK_FROSTINGS);
  }

  saveFrosting(frosting: Frosting): void {
    const list = this.getFrostings();
    const idx = list.findIndex((f) => f.id === frosting.id);
    if (idx >= 0) list[idx] = frosting;
    else list.push(frosting);
    this.setItem(STORAGE_KEYS.FROSTINGS, list);
  }

  getSizes(): CakeSize[] {
    return this.getItem<CakeSize[]>(STORAGE_KEYS.SIZES, MOCK_SIZES);
  }

  saveSize(size: CakeSize): void {
    const list = this.getSizes();
    const idx = list.findIndex((s) => s.id === size.id);
    if (idx >= 0) list[idx] = size;
    else list.push(size);
    this.setItem(STORAGE_KEYS.SIZES, list);
  }

  getDecorations(): Decoration[] {
    return this.getItem<Decoration[]>(STORAGE_KEYS.DECORATIONS, MOCK_DECORATIONS);
  }

  saveDecoration(decoration: Decoration): void {
    const list = this.getDecorations();
    const idx = list.findIndex((d) => d.id === decoration.id);
    if (idx >= 0) list[idx] = decoration;
    else list.push(decoration);
    this.setItem(STORAGE_KEYS.DECORATIONS, list);
  }

  // Designs
  getDesigns(userId?: string): CakeDesign[] {
    const designs = this.getItem<CakeDesign[]>(STORAGE_KEYS.DESIGNS, INITIAL_DESIGNS);
    return userId ? designs.filter((d) => d.user_id === userId) : designs;
  }

  getDesignById(id: string): CakeDesign | null {
    const designs = this.getDesigns();
    return designs.find((d) => d.id === id) || null;
  }

  saveDesign(design: CakeDesign): CakeDesign {
    const designs = this.getDesigns();
    const idx = designs.findIndex((d) => d.id === design.id);
    let updated: CakeDesign;
    if (idx >= 0) {
      updated = { ...designs[idx], ...design, updated_at: new Date().toISOString() };
      designs[idx] = updated;
    } else {
      updated = {
        ...design,
        id: design.id || `dsg-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      designs.unshift(updated);
    }
    this.setItem(STORAGE_KEYS.DESIGNS, designs);
    return updated;
  }

  deleteDesign(id: string): void {
    const designs = this.getDesigns().filter((d) => d.id !== id);
    this.setItem(STORAGE_KEYS.DESIGNS, designs);
  }

  // Orders
  getOrders(userId?: string): Order[] {
    const orders = this.getItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return userId ? orders.filter((o) => o.user_id === userId) : orders;
  }

  getOrderById(id: string): Order | null {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.order_number === id) || null;
  }

  saveOrder(order: Order): Order {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === order.id);
    let updated: Order;
    if (idx >= 0) {
      updated = { ...orders[idx], ...order, updated_at: new Date().toISOString() };
      orders[idx] = updated;
    } else {
      updated = {
        ...order,
        id: order.id || `ord-${Date.now()}`,
        order_number: order.order_number || `DC-${Math.floor(10000 + Math.random() * 90000)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      orders.unshift(updated);
    }
    this.setItem(STORAGE_KEYS.ORDERS, orders);
    return updated;
  }

  // Notifications
  getNotifications(userId?: string): NotificationItem[] {
    const notifs = this.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return userId ? notifs.filter((n) => n.user_id === userId) : notifs;
  }

  addNotification(notification: Omit<NotificationItem, 'id' | 'created_at'>): NotificationItem {
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      ...notification,
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    notifs.unshift(newNotif);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return newNotif;
  }

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const target = notifs.find((n) => n.id === id);
    if (target) {
      target.read = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  markAllNotificationsAsRead(userId: string): void {
    const notifs = this.getNotifications();
    notifs.forEach((n) => {
      if (n.user_id === userId) n.read = true;
    });
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  // Addresses
  getAddresses(userId: string): Address[] {
    const addrs = this.getItem<Address[]>(STORAGE_KEYS.ADDRESSES, []);
    return addrs.filter((a) => a.user_id === userId);
  }

  saveAddress(address: Address): Address {
    const addrs = this.getItem<Address[]>(STORAGE_KEYS.ADDRESSES, []);
    const idx = addrs.findIndex((a) => a.id === address.id);
    let updated: Address;
    if (idx >= 0) {
      updated = { ...addrs[idx], ...address, updated_at: new Date().toISOString() };
      addrs[idx] = updated;
    } else {
      updated = {
        ...address,
        id: address.id || `addr-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      addrs.unshift(updated);
    }
    this.setItem(STORAGE_KEYS.ADDRESSES, addrs);
    return updated;
  }

  deleteAddress(id: string): void {
    const addrs = this.getItem<Address[]>(STORAGE_KEYS.ADDRESSES, []).filter((a) => a.id !== id);
    this.setItem(STORAGE_KEYS.ADDRESSES, addrs);
  }

  // Status History
  getStatusHistory(orderId: string): OrderStatusHistory[] {
    const list = this.getItem<OrderStatusHistory[]>(STORAGE_KEYS.STATUS_HISTORY, [
      {
        id: 'hist-1',
        order_id: 'ord-101',
        status: 'PENDING_REVIEW',
        message: 'Cake design submitted by customer for review.',
        updater_name: 'Ananya Sharma (Customer)',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'hist-2',
        order_id: 'ord-101',
        status: 'PRICE_CONFIRMATION',
        message: 'Bakery evaluated specifications and quoted final price of ₹2,300.',
        updater_name: 'Chef Marco Rossi',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'hist-3',
        order_id: 'ord-101',
        status: 'CONFIRMED',
        message: 'Customer accepted final price and confirmed order.',
        updater_name: 'Ananya Sharma (Customer)',
        created_at: new Date(Date.now() - 80000000).toISOString(),
      },
      {
        id: 'hist-4',
        order_id: 'ord-101',
        status: 'PREPARING',
        message: 'Baking sponges and infusing signature cream cheese.',
        updater_name: 'Chef Marco Rossi',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ]);
    return list.filter((h) => h.order_id === orderId);
  }

  addStatusHistory(history: Omit<OrderStatusHistory, 'id' | 'created_at'>): OrderStatusHistory {
    const list = this.getItem<OrderStatusHistory[]>(STORAGE_KEYS.STATUS_HISTORY, []);
    const item: OrderStatusHistory = {
      ...history,
      id: `hist-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    list.unshift(item);
    this.setItem(STORAGE_KEYS.STATUS_HISTORY, list);
    return item;
  }

  // Order Notes
  getOrderNotes(orderId: string): OrderNote[] {
    const notes = this.getItem<OrderNote[]>(STORAGE_KEYS.ORDER_NOTES, [
      {
        id: 'note-1',
        order_id: 'ord-101',
        author_id: 'usr-staff-1',
        author_name: 'Chef Marco Rossi',
        note: 'Customer requested mild sweetness. Used organic vanilla syrup infusion and added gold leaf flourish.',
        internal: true,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ]);
    return notes.filter((n) => n.order_id === orderId);
  }

  addOrderNote(note: Omit<OrderNote, 'id' | 'created_at'>): OrderNote {
    const notes = this.getItem<OrderNote[]>(STORAGE_KEYS.ORDER_NOTES, []);
    const item: OrderNote = {
      ...note,
      id: `note-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    notes.push(item);
    this.setItem(STORAGE_KEYS.ORDER_NOTES, notes);
    return item;
  }
}

export const localDb = new LocalStorageDB();
localDb.init();
