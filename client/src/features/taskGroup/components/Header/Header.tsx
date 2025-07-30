import { ThemeToggleButton } from "../Theme/ThemeToggleButton";

export const Header = () => {
  return (
    <header className="w-full py-4  border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-[1fr_auto_1fr] items-center">
        {/* crutch to keep the title centered (redo later) */}
        <div></div>
        {/* crutch to keep the title centered (redo later) */}
        <h1 className="text-xl sm:text-2xl text-center font-semibold text-gray-900 dark:text-white">
          - Todo List -
        </h1>
        <div className="flex justify-end pr-2">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
};
