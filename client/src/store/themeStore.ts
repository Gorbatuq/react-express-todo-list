import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const raw = localStorage.getItem("theme");
  return raw === "dark" ? "dark" : "light";
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getStoredTheme(),
  setTheme: (theme) => {
    set(() => {
      try {
        localStorage.setItem("theme", theme);
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
      } catch (e) {
        console.warn("Failed to save theme", e);
      }
      return { theme };
    });
  },
}));

export const useTheme = () => useThemeStore();
