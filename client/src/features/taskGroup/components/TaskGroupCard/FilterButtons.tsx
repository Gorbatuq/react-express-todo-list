const options = ["all", "completed", "active"] as const;
type FilterType = (typeof options)[number];

interface Props {
  onChange: (type: FilterType) => void;
  currentFilter: FilterType;
}

export const FilterButtons = ({ onChange, currentFilter }: Props) => (
  <div className="flex justify-center mt-4 space-x-2">
    {options.map((type) => (
      <button
        key={type}
        onClick={() => onChange(type)}
        aria-pressed={currentFilter === type}
        className={`px-4 py-1 rounded-xl text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          currentFilter === type
            ? "bg-blue-500 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
        }`}
      >
        {type[0].toUpperCase() + type.slice(1)}
      </button>
    ))}
  </div>
);
