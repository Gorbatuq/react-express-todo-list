import { ThemeToggleButton } from "../Theme/ThemeToggleButton";

export const Header = () => {
  return (
    <header className="py-4 border-b border-gray-200 dark:border-gray-600">
      <h1 className="text-xl sm:text-2xl text-center font-semibold text-gray-900 dark:text-white">
        - Todo List -
      </h1>
      <div className="flex justify-end pr-2">
        <ThemeToggleButton />
      </div>
    </header>
  );
};
