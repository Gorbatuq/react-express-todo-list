import type { TaskGroup } from "../../../../types";

type Props = {
  disabled?: boolean;
  groups: TaskGroup[];
  onChange: (groupId: string) => void;
  value: string;
};

export const TaskChoiceGroupSelect = ({
  disabled,
  groups,
  onChange,
  value,
}: Props) => (
  <label className="block text-sm text-gray-600 dark:text-gray-300">
    Group
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="app-input mt-1 w-full"
    >
      <option value="all">All groups</option>
      {groups.map((group) => (
        <option key={group.id} value={group.id}>
          {group.title}
        </option>
      ))}
    </select>
  </label>
);
