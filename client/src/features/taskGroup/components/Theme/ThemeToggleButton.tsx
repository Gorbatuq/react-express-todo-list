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
                 bg-gray-200 dark:bg-gray-700 shadow-md dark:shadow-black/30
                 flex items-center justify-center transition-all duration-300
                 hover:scale-105 focus:outline-none"
    >
      <FaSun
        className={`absolute text-yellow-500 text-xl sm:text-2xl transition-all duration-500
                         ${
                           theme === "light"
                             ? "opacity-100 scale-100"
                             : "opacity-0 scale-0 rotate-45"
                         }`}
      />
      <FaMoon
        className={`absolute text-blue-400 text-xl sm:text-2xl transition-all duration-500
                         ${
                           theme === "dark"
                             ? "opacity-100 scale-100"
                             : "opacity-0 scale-0 rotate-45"
                         }`}
      />
    </button>
  );
};
