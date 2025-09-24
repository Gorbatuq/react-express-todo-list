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
        className={`px-4 py-1 rounded-xl text-sm font-medium transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-blue-400
          ${
            currentFilter === type
              ? // active button
                "bg-blue-500 text-white shadow-md dark:bg-blue-600 dark:text-white"
              : // inactive button
                "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600 dark:hover:text-white"
          }`}
      >
        {type[0].toUpperCase() + type.slice(1)}
      </button>
    ))}
  </div>
);
