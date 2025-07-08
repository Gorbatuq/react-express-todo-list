import type { FilterType } from "./TaskGroupCard.types";

interface Props {
  onChange: (type: FilterType) => void;
  currentFilter: FilterType;
}

export const FilterButtons = ({ onChange, currentFilter }: Props) => (
  <div className="flex justify-center mt-4 space-x-2">
    {(["all", "completed", "active"] as FilterType[]).map((type) => (
      <button
        key={type}
        className={`
          px-4 py-1 rounded-xl text-sm font-medium
          transition-colors duration-200
          ${
            currentFilter === type
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
          }
          focus:outline-none focus:ring-2 focus:ring-blue-400
        `}
        onClick={() => onChange(type)}
        aria-pressed={currentFilter === type}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    ))}
  </div>
);
