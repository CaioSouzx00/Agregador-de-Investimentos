import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from '@/shared/lib/storage';
import { decodeJwt, isTokenExpired } from '@/shared/utils/jwt';
import { AuthSessionUser } from '@/shared/types/api';
import { haptic } from '@/shared/utils/haptics';

interface AuthState {
  token: string | null;
  user: AuthSessionUser | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (token: string, expiresInMs?: number, userOverride?: Partial<AuthSessionUser>) => Promise<void>;
  updateUser: (user: Partial<AuthSessionUser>) => void;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: true,

      setSession: async (token: string, expiresInMs?: number, userOverride?: Partial<AuthSessionUser>) => {
        const payload = decodeJwt(token);

        const userId = userOverride?.userId || payload?.userId || (payload?.sub as string) || '';
        const username = userOverride?.username || (payload?.sub as string) || '';
        const email = userOverride?.email || (payload?.email as string) || '';

        const expiresAt = expiresInMs
          ? Date.now() + expiresInMs
          : payload?.exp
          ? payload.exp * 1000
          : Date.now() + 24 * 60 * 60 * 1000;

        const sessionUser: AuthSessionUser = {
          userId,
          username,
          email,
        };

        set({
          token,
          user: sessionUser,
          expiresAt,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      updateUser: (updated) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updated } });
        }
      },

      logout: async () => {
        haptic.light();
        set({
          token: null,
          user: null,
          expiresAt: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkAuth: () => {
        const { token, expiresAt } = get();
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return false;
        }

        const expired = (expiresAt && Date.now() > expiresAt) || isTokenExpired(token);
        if (expired) {
          get().logout();
          return false;
        }

        set({ isAuthenticated: true, isLoading: false });
        return true;
      },
    }),
    {
      name: 'agregador_auth_session',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkAuth();
        }
      },
    }
  )
);
