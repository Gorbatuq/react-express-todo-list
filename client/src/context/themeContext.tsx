import { createContext, useContext, useEffect, useState } from "react";
import { THEME, Theme } from "../types";

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return THEME.LIGHT;
  const saved = localStorage.getItem("theme");
  return saved === THEME.DARK ? THEME.DARK : THEME.LIGHT;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  // synchronization with DOM in localStorage
  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
      const root = document.documentElement;
      root.classList.remove(THEME.LIGHT, THEME.DARK);
      root.classList.add(theme);
    } catch (e) {
      console.warn("Failed to apply theme:", e);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
