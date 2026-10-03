import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type AuthStateStatus = 'guest' | 'otp_sent' | 'authenticated' | 'expired';

interface AuthState {
  status: AuthStateStatus;
  userEmail: string | null;
  userId: string | null;
  shortlist: string[]; // scheme slugs or IDs
  isLoading: boolean;
  errorMessage: string | null;

  // Actions
  initAuth: () => Promise<void>;
  requestOtp: (email: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  toggleShortlist: (schemeId: string) => Promise<void>;
  deleteMyData: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'guest',
  userEmail: null,
  userId: null,
  shortlist: [],
  isLoading: false,
  errorMessage: null,

  initAuth: async () => {
    if (!supabase) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        set({
          status: 'authenticated',
          userEmail: session.user.email ?? null,
          userId: session.user.id,
        });

        // Load shortlisted schemes for this user
        const { data: saved, error } = await supabase
          .from('shortlist')
          .select('scheme_id');

        if (!error && saved) {
          set({ shortlist: saved.map((row) => row.scheme_id) });
        }
      }

      // Listen to auth changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          set({
            status: 'authenticated',
            userEmail: session.user.email ?? null,
            userId: session.user.id,
          });
          if (supabase) {
            const { data: saved } = await supabase
              .from('shortlist')
              .select('scheme_id');
            if (saved) {
              set({ shortlist: saved.map((row) => row.scheme_id) });
            }
          }
        } else {
          set({
            status: 'guest',
            userEmail: null,
            userId: null,
            shortlist: [],
          });
        }
      });
    } catch (err) {
      console.error('Auth initialization error:', err);
    }
  },

  requestOtp: async (email: string) => {
    set({ isLoading: true, errorMessage: null });

    if (!supabase) {
      // In standalone/mock mode, simulate OTP sent
      set({
        isLoading: false,
        status: 'otp_sent',
        userEmail: email,
      });
      return true;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });

      if (error) {
        set({
          isLoading: false,
          errorMessage: error.message || 'Unable to send OTP. Please check your email.',
        });
        return false;
      }

      set({
        isLoading: false,
        status: 'otp_sent',
        userEmail: email,
      });
      return true;
    } catch {
      set({
        isLoading: false,
        errorMessage: 'Network error. Please try again.',
      });
      return false;
    }
  },

  verifyOtp: async (code: string) => {
    const { userEmail } = get();
    if (!userEmail) return false;

    set({ isLoading: true, errorMessage: null });

    if (!supabase) {
      // Offline/demo mock mode: accept any 6-digit code or "123456"
      if (code.length === 6) {
        set({
          isLoading: false,
          status: 'authenticated',
          userId: 'mock-user-123',
        });
        return true;
      } else {
        set({
          isLoading: false,
          errorMessage: 'Invalid 6-digit code. For demo, enter 123456.',
        });
        return false;
      }
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: code,
        type: 'email',
      });

      if (error || !data.session) {
        set({
          isLoading: false,
          errorMessage: error?.message || 'Invalid or expired OTP. Please try again.',
        });
        return false;
      }

      set({
        isLoading: false,
        status: 'authenticated',
        userId: data.user?.id ?? null,
      });

      // Load user shortlist
      const { data: saved } = await supabase
        .from('shortlist')
        .select('scheme_id');
      if (saved) {
        set({ shortlist: saved.map((row) => row.scheme_id) });
      }

      return true;
    } catch {
      set({
        isLoading: false,
        errorMessage: 'Network error verifying code.',
      });
      return false;
    }
  },

  signOut: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    set({
      status: 'guest',
      userEmail: null,
      userId: null,
      shortlist: [],
    });
  },

  toggleShortlist: async (schemeId: string) => {
    const { shortlist, userId } = get();
    const isSaved = shortlist.includes(schemeId);
    const newShortlist = isSaved
      ? shortlist.filter((id) => id !== schemeId)
      : [...shortlist, schemeId];

    set({ shortlist: newShortlist });

    if (supabase && userId) {
      try {
        if (isSaved) {
          await supabase.from('shortlist').delete().eq('scheme_id', schemeId);
        } else {
          await supabase.from('shortlist').insert({ scheme_id: schemeId });
        }
      } catch (err) {
        console.error('Error syncing shortlist with DB:', err);
      }
    }
  },

  deleteMyData: async () => {
    set({ isLoading: true });
    if (supabase) {
      try {
        await supabase.rpc('delete_my_data');
      } catch (err) {
        console.error('Error wiping shortlist data:', err);
      }
    }
    set({ shortlist: [], isLoading: false });
    return true;
  },

  clearError: () => set({ errorMessage: null }),
}));
