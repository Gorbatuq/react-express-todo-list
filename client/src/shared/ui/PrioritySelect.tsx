import type { SelectHTMLAttributes } from "react";
import { DEFAULT_PRIORITY, PRIORITY_OPTIONS, type Priority } from "../../types";

type PrioritySelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
> & {
  value: Priority;
  onChange: (priority: Priority) => void;
};

export const PrioritySelect = ({
  value,
  onChange,
  className = "",
  ...props
}: PrioritySelectProps) => {
  return (
    <select
      value={value}
      onChange={(event) => {
        const nextPriority =
          PRIORITY_OPTIONS.find(
            (option) => String(option.value) === event.target.value,
          )?.value ?? DEFAULT_PRIORITY;

        onChange(nextPriority);
      }}
      className={`app-input ${className}`}
      {...props}
    >
      {PRIORITY_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
