import { CakeCategory, CakeFlavor, Frosting, CakeSize, Decoration } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localDb } from '../lib/storage';

export class CakeService {
  static async getCategories(): Promise<CakeCategory[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('cake_categories')
          .select('*')
          .eq('active', true)
          .order('base_price', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed for categories:', e);
      }
    }
    return localDb.getCategories();
  }

  static async getFlavors(): Promise<CakeFlavor[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('cake_flavors')
          .select('*')
          .eq('active', true)
          .order('name', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed for flavors:', e);
      }
    }
    return localDb.getFlavors();
  }

  static async getFrostings(): Promise<Frosting[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('frostings')
          .select('*')
          .eq('active', true)
          .order('name', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed for frostings:', e);
      }
    }
    return localDb.getFrostings();
  }

  static async getSizes(): Promise<CakeSize[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('cake_sizes')
          .select('*')
          .eq('active', true)
          .order('weight_kg', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed for sizes:', e);
      }
    }
    return localDb.getSizes();
  }

  static async getDecorations(): Promise<Decoration[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('decorations')
          .select('*')
          .eq('active', true)
          .order('category', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed for decorations:', e);
      }
    }
    return localDb.getDecorations();
  }
}
