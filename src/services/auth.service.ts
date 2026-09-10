import { Profile, UserRole } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localDb } from '../lib/storage';

export class AuthService {
  static async getCurrentUser(): Promise<Profile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();
        return profile || null;
      } catch (e) {
        console.warn('Supabase auth check failed, falling back to local store:', e);
      }
    }
    return localDb.getCurrentUser();
  }

  static async signUp(email: string, password: string, fullName: string, phone?: string): Promise<{ user: Profile | null; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone },
          },
        });
        if (error) return { user: null, error: error.message };

        if (data.user) {
          const newProfile: Profile = {
            id: data.user.id,
            auth_user_id: data.user.id,
            full_name: fullName,
            email,
            phone,
            role: 'customer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await supabase.from('profiles').insert(newProfile);
          return { user: newProfile, error: null };
        }
      } catch (e: any) {
        return { user: null, error: e.message || 'Signup failed' };
      }
    }

    // Local / Mock Signup
    const profiles = localDb.getProfiles();
    if (profiles.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
      return { user: null, error: 'An account with this email already exists.' };
    }

    const newProfile: Profile = {
      id: `usr-${Date.now()}`,
      auth_user_id: `auth-${Date.now()}`,
      full_name: fullName,
      email,
      phone,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=be123c,e11d48,d4af37`,
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localDb.saveProfile(newProfile);
    localDb.setCurrentUser(newProfile);
    return { user: newProfile, error: null };
  }

  static async signIn(email: string, password: string): Promise<{ user: Profile | null; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { user: null, error: error.message };
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user_id', data.user.id)
            .single();
          return { user: profile, error: null };
        }
      } catch (e: any) {
        return { user: null, error: e.message || 'Login failed' };
      }
    }

    // Local / Mock SignIn
    const profiles = localDb.getProfiles();
    const found = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { user: null, error: 'No account found with this email. Please check your credentials or create an account.' };
    }

    localDb.setCurrentUser(found);
    return { user: found, error: null };
  }

  static async switchDemoRole(role: UserRole): Promise<Profile> {
    const profiles = localDb.getProfiles();
    const demoUser = profiles.find((p) => p.role === role) || {
      id: `usr-${role}-${Date.now()}`,
      auth_user_id: `auth-${role}`,
      full_name: role === 'admin' ? 'Priya Iyer (Bakery Owner)' : role === 'staff' ? 'Chef Marco Rossi (Head Baker)' : 'Ananya Sharma (Customer)',
      email: `${role}@dreamcake.ai`,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localDb.setCurrentUser(demoUser);
    return demoUser;
  }

  static async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Signout error:', e);
      }
    }
    localDb.setCurrentUser(null);
  }

  static async updateProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
    const current = localDb.getCurrentUser();
    const updated: Profile = {
      ...(current as Profile),
      ...profile,
      updated_at: new Date().toISOString(),
    };
    localDb.saveProfile(updated);
    return updated;
  }
}
