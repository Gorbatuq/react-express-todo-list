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
        className={`h-9 w-auto ${rotate}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
    );
  }

  return (
    <header className="relative flex items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-600">
      <ProfileButton />
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        <Sword rotate="rotate-90" />

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
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
