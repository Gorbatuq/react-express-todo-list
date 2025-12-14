import { ThemeToggleButton } from "../../ui/ThemeToggleButton";
import { ProfileButton } from "../../ui/ProfileButton";

export const Header = () => {
  return (
    <header className="relative flex items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-600">
      <ProfileButton />

      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
        - FinTask -
      </h1>

      <ThemeToggleButton />
    </header>
  );
};
