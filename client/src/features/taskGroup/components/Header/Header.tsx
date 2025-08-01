import { useNavigate } from "react-router-dom";
import { ThemeToggleButton } from "../Theme/ThemeToggleButton";
import { PiFinnTheHumanLight } from "react-icons/pi";

export const Header = () => {
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="relative flex items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-600">
      <button className="flex items-center" onClick={() => handleGoToProfile()}>
        <PiFinnTheHumanLight className="text-5xl p-1 border-2 bg-slate-50 dark:text-gray-900 border-slate-300 rounded-full" />
      </button>
      <div className="flex items-center">
        <ThemeToggleButton />
      </div>
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
        - Todo List -
      </h1>

      <div className="flex items-center">
        <ThemeToggleButton />
      </div>
    </header>
  );
};
