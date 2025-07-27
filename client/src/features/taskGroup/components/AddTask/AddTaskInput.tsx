import { PiPlus } from "react-icons/pi";
import { memo } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onAdd: (title: string) => Promise<void>;
}

export const AddTaskInput = memo(({ value, onChange, onAdd }: Props) => {
  const handleAdd = async () => {
    const title = value.trim();
    if (!title) return;
    try {
      await onAdd(title);
      onChange("");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="New Task"
        className="flex-1 border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-400 hover:bg-green-500 text-white px-2 rounded"
      >
        <PiPlus />
      </button>
    </div>
  );
});
