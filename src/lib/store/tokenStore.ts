import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    userId: string,
    user?: { name?: string; role?: string }
  ) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      userName: null,
      userRole: null,
      setTokens: (accessToken, refreshToken, userId, user) => {
        set({
          accessToken,
          refreshToken,
          userId,
          userName: user?.name ?? null,
          userRole: user?.role ?? null,
        });
        if (typeof document !== 'undefined') {
          document.cookie = `auth-token=${accessToken}; path=/; max-age=${15 * 60}`;
        }
      },
      clearTokens: () => {
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          userName: null,
          userRole: null,
        });
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-token=; path=/; max-age=0';
        }
      },
      getAccessToken: () => get().accessToken,
    }),
    {
      name: 'token-store',
    }
  )
);
