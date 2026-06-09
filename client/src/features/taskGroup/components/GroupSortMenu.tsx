import { useState } from "react";
import {
  FiClock,
  FiFilter,
  FiFlag,
  FiMove,
  FiPlusCircle,
} from "react-icons/fi";
import { GROUP_SORT_OPTIONS, type GroupSortType } from "../../../types";

type Props = {
  value: GroupSortType;
  onChange: (value: GroupSortType) => void;
};

const sortIcons: Record<GroupSortType, React.ReactNode> = {
  manual: <FiMove />,
  createdAt: <FiPlusCircle />,
  updatedAt: <FiClock />,
  priority: <FiFlag />,
};

export const GroupSortMenu = ({ value, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentOption = GROUP_SORT_OPTIONS.find(
    (option) => option.value === value,
  );

  const selectSort = (nextValue: GroupSortType) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        aria-label="Sort groups"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="app-icon-button app-icon-button-muted h-10 gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-800"
      >
        <FiFilter className="text-base" />
        <span>{currentOption?.label ?? "Sort"}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          aria-hidden="true"
          onMouseDown={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
          {GROUP_SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectSort(option.value)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                value === option.value
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
              }`}
            >
              <span className="text-base">{sortIcons[option.value]}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
