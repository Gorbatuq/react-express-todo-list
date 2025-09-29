import { Link } from "react-router-dom";
import { ThemeToggleButton } from "../../ui/ThemeToggleButton";
import { PiFinnTheHumanLight } from "react-icons/pi";

export const Header = () => {
  return (
    <header className="relative flex items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-600">
      {/* user icons */}
      <Link to="/profile" className="flex items-center">
        <PiFinnTheHumanLight className="text-5xl p-1 border-2 bg-slate-50 dark:bg-gray-700 dark:text-gray-200 border-slate-300 dark:border-slate-600  rounded-full" />
      </Link>

      {/* name */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
        - FinTask -
      </h1>

      {/* theme button */}
      <ThemeToggleButton />
    </header>
  );
};
