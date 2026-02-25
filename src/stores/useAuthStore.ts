import { create } from 'zustand';

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setAuthInitialized: () => void;
};

const useAuthStore = create<AuthStoreState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isAuthInitialized: false,
  setAccessToken: (token: string) =>
    set({ accessToken: token, isAuthenticated: true }),
  clearAuth: () => set({ accessToken: null, isAuthenticated: false }),
  setAuthInitialized: () => set({ isAuthInitialized: true }),
}));

export default useAuthStore;
