import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authStorage } from './secureStorage';

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  rehydrate: 'pending' | 'fulfilled' | 'rejected';
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clearAuth: () => void;
  setAuthInitialized: () => void;
};

const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAuthInitialized: false,
      rehydrate: 'pending',
      setAccessToken: (token: string) =>
        set({ accessToken: token, isAuthenticated: true }),
      setRefreshToken: (token: string) => set({ refreshToken: token }),
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, isAuthenticated: false }),
      setAuthInitialized: () => set({ isAuthInitialized: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          accessToken?: string | null;
          refreshToken?: string | null;
        } | null;
        return {
          ...currentState,
          ...(persisted ?? {}),
          isAuthenticated: !!persisted?.accessToken,
        };
      },
      onRehydrateStorage: () => {
        return (_state, error) => {
          useAuthStore.setState({
            rehydrate: error ? 'rejected' : 'fulfilled',
          });
        };
      },
    },
  ),
);

export default useAuthStore;
