import { create } from "zustand";
import { authApi } from "@/api/auth";
import type { User } from "@/types";

type AuthStore = {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  isAuth: boolean;
  init: () => Promise<void>;
  logout: () => Promise<void>;
};

function deriveAuthState(user: User | null) {
  if (!user) {
    return { isGuest: false, isAuth: false };
  }
  if (user.role === "GUEST") {
    return { isGuest: true, isAuth: false };
  }
  return { isGuest: false, isAuth: true };
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  isGuest: false,
  isAuth: false,

  init: async () => {
    set({ loading: true });

    try {
      const user = await authApi.getMe();
      set({ user, ...deriveAuthState(user) });
      return;
    } catch (err: any) {
      const status = err?.response?.status;

      switch (status) {
        case 401: {
          const hasToken = document.cookie.includes("token=");
          if (!hasToken) {
            const guest = await authApi.createGuest();
            set({ user: guest, ...deriveAuthState(guest) });
          } else {
            set({ user: null, ...deriveAuthState(null) });
          }
          break;
        }

        default: {
          set({ user: null, ...deriveAuthState(null) });
        }
      }
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, ...deriveAuthState(null) });
  },
}));
