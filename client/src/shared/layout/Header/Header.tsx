import { ThemeToggleButton } from "../../ui/ThemeToggleButton";
import { ProfileButton } from "../../ui/ProfileButton";
import { useState } from "react";

type HeaderProps = {
  actions?: React.ReactNode;
};

export const Header = ({ actions }: HeaderProps) => {
  function Sword({ rotate }: { rotate: string }) {
    const [hover, setHover] = useState(false);

    return (
      <img
        src={
          hover
            ? "/pixel_sword_spin_pixel_128.gif"
            : "/pixel_sword_spin_pixel2.png"
        }
        className={`h-11 w-auto ${rotate}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
    );
  }

  return (
    <header className="relative flex w-full min-w-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-600 dark:bg-zinc-800">
      <ProfileButton />
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        <Sword rotate="rotate-90" />

        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
          FinTask
        </h1>

        <Sword rotate="-rotate-90" />
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <ThemeToggleButton />
      </div>
    </header>
  );
};
