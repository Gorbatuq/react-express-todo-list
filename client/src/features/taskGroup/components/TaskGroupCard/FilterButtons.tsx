import type { FilterType } from "./TaskGroupCard.types";

interface Props {
  onChange: (type: FilterType) => void;
}

export const FilterButtons = ({ onChange }: Props) => (
  <div className="flex justify-center mt-3 space-x-3">
    {(["all", "completed", "active"] as FilterType[]).map((type) => (
      <button
        key={type}
        className="text-sm underline"
        onClick={() => onChange(type)}
      >
        {type}
      </button>
    ))}
  </div>
);
