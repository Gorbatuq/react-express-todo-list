import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/context/themeContext";

export const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle Theme"
      className="fixed top-4 right-2 
             [width:clamp(3rem,5vw,3rem)]
             [height:clamp(3rem,5vw,2rem)]
             rounded-full border-2 
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
        className={`absolute text-blue-400 text-2xl transition-all duration-500
      ${
        theme === "dark"
          ? "opacity-100 scale-100"
          : "opacity-0 scale-0 rotate-45"
      }`}
      />
    </button>
  );
};
