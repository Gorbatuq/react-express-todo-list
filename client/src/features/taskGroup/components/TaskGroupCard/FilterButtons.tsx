type FilterType = "all" | "completed" | "active";

const filterOptions: FilterType[] = ["all", "completed", "active"];

interface Props {
  onChange: (type: FilterType) => void;
  currentFilter: FilterType;
}

export const FilterButtons = ({ onChange, currentFilter }: Props) => (
  <div className="flex justify-center mt-4 space-x-2">
    {filterOptions.map((type) => {
      const isActive = currentFilter === type;
      const baseClasses =
        "px-4 py-1 rounded-xl text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400";
      const activeClasses = "bg-blue-500 text-white shadow-md";
      const inactiveClasses =
        "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700";

      return (
        <button
          key={type}
          className={`${baseClasses} ${
            isActive ? activeClasses : inactiveClasses
          }`}
          onClick={() => onChange(type)}
          aria-pressed={isActive}
        >
          {type[0].toUpperCase() + type.slice(1)}
        </button>
      );
    })}
  </div>
);
