import { useEffect, useState } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { MdOutlineDelete } from "react-icons/md";
import type { Priority } from "@/types";

interface Props {
  groupId: string;
  title: string;
  isEditing: boolean;
  setEditingGroupId: (id: string | null) => void;
  handleGroupEditSubmit: (title: string, priority: Priority) => Promise<void>;
  handleDeleteGroup: () => Promise<void>;
  priority: Priority;
}

export const GroupHeader = ({
  groupId,
  title,
  isEditing,
  setEditingGroupId,
  handleGroupEditSubmit,
  handleDeleteGroup,
  priority,
}: Props) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localPriority, setLocalPriority] = useState<Priority>(priority || 2);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setLocalTitle(title);
      setLocalPriority(priority);
    }
  }, [isEditing, title, priority]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = localTitle.trim();
    if (!trimmed) return;
    await handleGroupEditSubmit(trimmed, localPriority);
    setEditingGroupId(null);
  };

  const onDelete = async () => {
    await handleDeleteGroup();
    setShowConfirm(false);
  };

  const priorityColors = {
    1: "bg-red-500",
    2: "bg-yellow-500",
    3: "bg-green-500",
    4: "bg-blue-500",
  };

  return (
    <div className="flex justify-between items-center relative mb-4">
      {isEditing ? (
        <form
          onSubmit={onFormSubmit}
          className="flex items-center gap-2 flex-wrap"
        >
          <input
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            autoFocus
            className="border rounded px-2 py-1"
          />
          <select
            value={localPriority}
            onChange={(e) => setLocalPriority(+e.target.value as Priority)}
            className="border rounded px-2 py-1"
          >
            <option value={1}>Hight</option>
            <option value={2}>Mid</option>
            <option value={3}>Lou</option>
            <option value={4}>Sou Lou</option>
          </select>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            OK
          </button>
        </form>
      ) : (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setEditingGroupId(groupId)}
        >
          <span
            className={`w-3 h-3 rounded-full ${priorityColors[priority]}`}
          />
          <span className="text-lg font-semibold truncate max-w-full break-words">
            {title}
          </span>
        </div>
      )}

      <button
        onClick={() => setShowConfirm(true)}
        className="ml-3 text-red-600 text-xl focus:outline-none focus:ring-2 focus:ring-red-400"
        aria-label="Delete group"
      >
        <MdOutlineDelete />
      </button>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure?"
          onConfirm={onDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};
