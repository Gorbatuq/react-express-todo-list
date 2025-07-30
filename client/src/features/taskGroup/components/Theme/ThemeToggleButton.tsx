import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/store/themeStore";

export const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  // On desktop. Overlaps groups at size 150%
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle Theme"
      className="fixed top-2 right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full
                 border-2 
                 flex items-center justify-center
                 transition-all duration-300 hover:scale-105
                 bg-white dark:bg-slate-800"
    >
      <FaSun
        className={`absolute text-yellow-400 text-2xl transition-all duration-500
          ${
            theme === "light"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-0 rotate-45"
          }`}
      />
      <FaMoon
        className={`absolute text-blue-500 text-2xl transition-all duration-500
          ${
            theme === "dark"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-0 rotate-45"
          }`}
      />
    </button>
  );
};
