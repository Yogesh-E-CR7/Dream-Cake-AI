import { create } from 'zustand';
import { Profile, UserRole } from '../types/database.types';
import { AuthService } from '../services/auth.service';

interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (email: string, pass: string, name: string, phone?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
  clearError: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,

  init: async () => {
    set({ isLoading: true });
    try {
      const user = await AuthService.getCurrentUser();
      set({ user, isLoading: false });
    } catch (e) {
      set({ user: null, isLoading: false });
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    const { user, error } = await AuthService.signIn(email, password);
    if (error) {
      set({ error, isLoading: false });
      return false;
    }
    set({ user, isLoading: false, error: null });
    return true;
  },

  signUp: async (email, password, fullName, phone) => {
    set({ isLoading: true, error: null });
    const { user, error } = await AuthService.signUp(email, password, fullName, phone);
    if (error) {
      set({ error, isLoading: false });
      return false;
    }
    set({ user, isLoading: false, error: null });
    return true;
  },

  signOut: async () => {
    set({ isLoading: true });
    await AuthService.signOut();
    set({ user: null, isLoading: false });
  },

  switchDemoRole: async (role: UserRole) => {
    set({ isLoading: true });
    const user = await AuthService.switchDemoRole(role);
    set({ user, isLoading: false });
  },

  clearError: () => set({ error: null }),

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;
    const updated = await AuthService.updateProfile({ ...updates, id: user.id });
    set({ user: updated });
  },
}));
