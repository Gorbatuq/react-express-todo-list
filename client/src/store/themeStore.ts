import { create } from "zustand";

type Theme = "light" | "dark";
type ThemeState = { theme: Theme; setTheme: (t: Theme) => void };

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem("theme") as Theme) || "light",
    setTheme: (theme) => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
        set({ theme });
    }
}));

export const useTheme = () => useThemeStore();


