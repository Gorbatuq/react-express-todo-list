export const AddTaskInput = ({
  groupId,
  value,
  onChange,
  onAdd,
  reload,
}: {
  groupId: string;
  value: string;
  onChange: (val: string) => void;
  onAdd: (groupId: string, title: string) => Promise<void>;
  reload: () => void;
}) => {
  const handleAdd = async () => {
    const title = value.trim();
    if (!title) return;
    try {
      await onAdd(groupId, title);
      onChange("");
      reload();
    } catch (err) {
      console.error("Не вдалося додати задачу:", err);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="New Task"
        className="flex-1 border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <button
        className="bg-green-400 hover:bg-green-500 text-white px-2 rounded"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};
