import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle Theme"
      className="fixed top-2 right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 
                rounded-full
              bg-gray-200 dark:bg-gray-700
                shadow-md dark:shadow-black/30
                flex items-center justify-center
                transition-all duration-300 hover:scale-105 focus:outline-none"
    >
      {/* Sun icon */}
      <FaSun
        className={`absolute text-yellow-500 text-xl sm:text-2xl transition-all duration-500 transform
          ${
            theme === "light"
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-0 rotate-45"
          }`}
      />
      {/* Moon icon */}
      <FaMoon
        className={`absolute text-blue-400 text-xl sm:text-2xl transition-all duration-500 transform
          ${
            theme === "dark"
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-0 rotate-45"
          }`}
      />
    </button>
  );
};
