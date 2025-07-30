import { create } from "zustand";

type Theme = "light" | "dark";
type ThemeState = { theme: Theme; setTheme: (t: Theme) => void };

const storedTheme = (localStorage.getItem("theme") as Theme) || "light";

if (storedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: storedTheme,
  setTheme: (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));


export const useTheme = () => useThemeStore();
