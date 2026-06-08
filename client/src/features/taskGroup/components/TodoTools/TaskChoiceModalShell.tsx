import { type ReactNode, useEffect } from "react";
import { FiX } from "react-icons/fi";

type Props = {
  children: ReactNode;
  icon: ReactNode;
  maxWidth?: string;
  onClose: () => void;
  title: string;
};

const useBodyScrollLock = () => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);
};

export const TaskChoiceModalShell = ({
  children,
  icon,
  maxWidth = "max-w-3xl",
  onClose,
  title,
}: Props) => {
  useBodyScrollLock();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
      <div
        className="fixed inset-0 bg-black/20"
        aria-hidden="true"
        onMouseDown={onClose}
      />

      <div
        className="relative z-10 flex min-h-full items-center"
        onMouseDown={onClose}
      >
        <div
          className={`app-card mx-auto w-full ${maxWidth} overflow-visible p-5 sm:p-6`}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="mb-5 flex items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              {icon}
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="app-icon-button app-icon-button-muted h-8 w-8"
            >
              <FiX />
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
