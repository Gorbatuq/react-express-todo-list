import { create } from "zustand";
import { authApi } from "@/api/auth";
import type { User } from "@/types";

type AuthStore = {
  user: User | null;
  loading: boolean;
  init: () => Promise<void>;
  logout: () => Promise<void>;
  isGuest: boolean;
  isAuth: boolean;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,

  isGuest: false,
  isAuth: false,

  init: async () => {
    console.log("🟡 [authStore] init() called");
    set({ loading: true });

    try {
      const user = await authApi.getMe();
      console.log("🟢 [authStore] Fetched user:", user);

      set({
        user,
        isGuest: user.role === "GUEST",
        isAuth: !!user && user.role !== "GUEST",
      });

    } catch (err: any) {
      console.warn("🔴 [authStore] getMe failed", err);

      if (err.response?.status === 401) {
        const hasToken = document.cookie.includes("token=");
        console.log("🔎 [authStore] 401 + token:", hasToken);

        if (!hasToken) {
          console.log("⚪ [authStore] Creating guest...");
          const guest = await authApi.createGuest();
          console.log("🟢 [authStore] Guest created:", guest);

          set({ user: guest, isGuest: true, isAuth: false });
        } else {
          console.warn("⚠️ [authStore] Token exists, but unauthorized");
          set({ user: null, isGuest: false, isAuth: false });
        }
      } else {
        console.error("🔥 [authStore] Unknown error:", err);
        set({ user: null, isGuest: false, isAuth: false });
      }
    } finally {
      console.log("✅ [authStore] Loading finished");
      set({ loading: false });
    }

    console.log("📦 [authStore] Final state:", get());
  },

  logout: async () => {
    console.log("🔁 [authStore] Logging out...");
    await authApi.logout();
    set({ user: null, isGuest: false, isAuth: false });
    console.log("🚪 [authStore] Logged out");
  },
}));
