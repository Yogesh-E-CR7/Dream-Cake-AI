import { CakeDesign } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localDb } from '../lib/storage';

export class DesignService {
  static async getDesigns(userId?: string): Promise<CakeDesign[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('cake_designs').select('*, category:cake_categories(*), flavor:cake_flavors(*), frosting:frostings(*), size:cake_sizes(*)').order('created_at', { ascending: false });
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase fetch designs failed:', e);
      }
    }
    return localDb.getDesigns(userId);
  }

  static async getDesignById(id: string): Promise<CakeDesign | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('cake_designs')
          .select('*, category:cake_categories(*), flavor:cake_flavors(*), frosting:frostings(*), size:cake_sizes(*)')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase fetch design by id failed:', e);
      }
    }
    return localDb.getDesignById(id);
  }

  static async saveDesign(design: Partial<CakeDesign> & { user_id: string }): Promise<CakeDesign> {
    const categories = localDb.getCategories();
    const flavors = localDb.getFlavors();
    const frostings = localDb.getFrostings();
    const sizes = localDb.getSizes();

    const fullDesign: CakeDesign = {
      id: design.id || `dsg-${Date.now()}`,
      user_id: design.user_id,
      name: design.name || 'My Custom Dream Cake',
      occasion: design.occasion || 'Birthday',
      category_id: design.category_id || categories[0]?.id,
      flavor_id: design.flavor_id || flavors[0]?.id,
      frosting_id: design.frosting_id || frostings[0]?.id,
      size_id: design.size_id || sizes[0]?.id,
      shape: design.shape || 'Round',
      tiers: design.tiers || 1,
      theme: design.theme || 'Floral Luxury',
      primary_color: design.primary_color || '#FFF1F4',
      secondary_color: design.secondary_color || '#BE123C',
      accent_color: design.accent_color || '#D4AF37',
      decorations: design.decorations || [],
      cake_message: design.cake_message || '',
      special_requirements: design.special_requirements || '',
      reference_image_url: design.reference_image_url || '',
      ai_preview_url: design.ai_preview_url || '',
      ai_analysis: design.ai_analysis || {},
      estimated_price: design.estimated_price || 1200,
      status: design.status || 'READY',
      is_favorite: design.is_favorite || false,
      created_at: design.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('cake_designs').upsert(fullDesign).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase save design failed:', e);
      }
    }

    return localDb.saveDesign(fullDesign);
  }

  static async deleteDesign(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cake_designs').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete design failed:', e);
      }
    }
    localDb.deleteDesign(id);
  }

  static async toggleFavorite(id: string): Promise<CakeDesign | null> {
    const design = await this.getDesignById(id);
    if (!design) return null;
    return this.saveDesign({ ...design, is_favorite: !design.is_favorite });
  }

  static async duplicateDesign(id: string, newUserId: string): Promise<CakeDesign | null> {
    const design = await this.getDesignById(id);
    if (!design) return null;
    const duplicated: Partial<CakeDesign> = {
      ...design,
      id: undefined,
      user_id: newUserId,
      name: `${design.name} (Copy)`,
      created_at: undefined,
      updated_at: undefined,
    };
    return this.saveDesign(duplicated as any);
  }
}
