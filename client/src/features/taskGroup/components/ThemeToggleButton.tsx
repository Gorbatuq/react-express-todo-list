import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

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
      className="self-end p-3 rounded-full bg-gray-300 dark:bg-gray-700
        transition-all duration-700 ease-in-out relative overflow-hidden w-12 h-12 flex items-center justify-center"
    >
      <FaSun
        className={`absolute text-yellow-500 text-2xl transition-all duration-700 transform
          ${
            theme === "light"
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-0 rotate-45"
          }`}
      />
      <FaMoon
        className={`absolute text-blue-400 text-2xl transition-all duration-700 transform
          ${
            theme === "dark"
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-0 rotate-45"
          }`}
      />
    </button>
  );
};
