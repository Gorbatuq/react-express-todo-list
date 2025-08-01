import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

// Validate the topic with localStorage
const isValidTheme = (t: any): t is Theme => t === "light" || t === "dark";
const raw = localStorage.getItem("theme");
const storedTheme: Theme = isValidTheme(raw) ? raw : "light";
//

export const useThemeStore = create<ThemeState>((set) => ({
  theme: storedTheme,
  setTheme: (theme) => {
    set((state) => {
      if (state.theme === theme) return state;
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        console.warn("Failed to save topic", e);
      }
      return { theme };
    });
  },
}));

export const useTheme = () => useThemeStore();
