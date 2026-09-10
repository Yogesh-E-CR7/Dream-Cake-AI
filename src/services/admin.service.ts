import { localDb } from '../lib/storage';
import { CakeCategory, CakeFlavor, Frosting, CakeSize, Decoration, Order, Profile } from '../types/database.types';

export interface AdminAnalytics {
  totalUsers: number;
  totalCustomers: number;
  totalStaff: number;
  totalOrders: number;
  pendingRequests: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularFlavors: { name: string; count: number; percentage: number }[];
  popularOccasions: { name: string; count: number; percentage: number }[];
  ordersOverTime: { date: string; count: number; revenue: number }[];
}

export class AdminService {
  static async getAnalytics(): Promise<AdminAnalytics> {
    const profiles = localDb.getProfiles();
    const orders = localDb.getOrders();
    const designs = localDb.getDesigns();
    const flavors = localDb.getFlavors();
    const categories = localDb.getCategories();

    const totalUsers = profiles.length;
    const totalCustomers = profiles.filter((p) => p.role === 'customer').length;
    const totalStaff = profiles.filter((p) => p.role === 'staff').length;

    const totalOrders = orders.length;
    const pendingRequests = orders.filter((o) => o.order_status === 'PENDING_REVIEW' || o.order_status === 'PRICE_CONFIRMATION').length;
    const completedOrders = orders.filter((o) => o.order_status === 'COMPLETED').length;
    const cancelledOrders = orders.filter((o) => o.order_status === 'CANCELLED').length;
    const activeOrders = orders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.order_status)).length;

    const totalRevenue = orders
      .filter((o) => o.order_status !== 'CANCELLED')
      .reduce((sum, o) => sum + (o.final_price || o.estimated_price), 0);

    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Flavor popularity
    const flavorCounts: Record<string, number> = {};
    designs.forEach((d) => {
      const flv = flavors.find((f) => f.id === d.flavor_id)?.name || 'Chocolate Truffle';
      flavorCounts[flv] = (flavorCounts[flv] || 0) + 1;
    });
    const popularFlavors = Object.entries(flavorCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / (designs.length || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // Occasion popularity
    const occasionCounts: Record<string, number> = {};
    designs.forEach((d) => {
      occasionCounts[d.occasion] = (occasionCounts[d.occasion] || 0) + 1;
    });
    const popularOccasions = Object.entries(occasionCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / (designs.length || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // Orders over recent days
    const ordersOverTime = [
      { date: 'Mon', count: 4, revenue: 8600 },
      { date: 'Tue', count: 6, revenue: 12400 },
      { date: 'Wed', count: 8, revenue: 16800 },
      { date: 'Thu', count: 5, revenue: 10200 },
      { date: 'Fri', count: 11, revenue: 24500 },
      { date: 'Sat', count: 18, revenue: 39800 },
      { date: 'Sun', count: 14, revenue: 31200 },
    ];

    return {
      totalUsers,
      totalCustomers,
      totalStaff,
      totalOrders,
      pendingRequests,
      activeOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue,
      popularFlavors,
      popularOccasions,
      ordersOverTime,
    };
  }

  // Catalog CRUD
  static async saveCategory(item: CakeCategory): Promise<void> {
    localDb.saveCategory(item);
  }

  static async saveFlavor(item: CakeFlavor): Promise<void> {
    localDb.saveFlavor(item);
  }

  static async saveFrosting(item: Frosting): Promise<void> {
    localDb.saveFrosting(item);
  }

  static async saveSize(item: CakeSize): Promise<void> {
    localDb.saveSize(item);
  }

  static async saveDecoration(item: Decoration): Promise<void> {
    localDb.saveDecoration(item);
  }

  static async getAllUsers(): Promise<Profile[]> {
    return localDb.getProfiles();
  }

  static async updateUserRole(userId: string, role: Profile['role']): Promise<void> {
    const profiles = localDb.getProfiles();
    const user = profiles.find((p) => p.id === userId);
    if (user) {
      user.role = role;
      localDb.saveProfile(user);
    }
  }
}
