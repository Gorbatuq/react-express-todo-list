import { useEffect, useState } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
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
  const [localPriority, setLocalPriority] = useState<Priority>(priority);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      await handleGroupEditSubmit(trimmed, localPriority);
      setEditingGroupId(null);
      setError(null);
    } catch (err) {
      setError("Failed to save changes. Try again.");
    }
  };

  const onDelete = async () => {
    try {
      await handleDeleteGroup();
    } finally {
      setShowConfirm(false);
    }
  };

  const priorityColors: Record<Priority, string> = {
    1: "bg-red-500",
    2: "bg-orange-400",
    3: "bg-yellow-200",
    4: "bg-blue-100",
  };

  return (
    <div className="flex justify-between items-center relative mb-4 ">
      {isEditing ? (
        <form
          onSubmit={onFormSubmit}
          className="flex items-center gap-2 flex-wrap"
        >
          <input
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={() => !localTitle.trim() && setEditingGroupId(null)}
            autoFocus
            className="border rounded px-2 py-1"
          />
          <select
            value={localPriority}
            onChange={(e) => setLocalPriority(+e.target.value as Priority)}
            className="border rounded px-2 py-1"
          >
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
            <option value={4}>Super Low</option>
          </select>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            OK
          </button>
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${priorityColors[priority]}`}
          />
          <span className="text-lg font-semibold break-words">{title}</span>
          <button
            onClick={() => setEditingGroupId(groupId)}
            className="ml-2 text-gray-500 hover:text-blue-600"
            aria-label="Edit group"
          >
            <MdOutlineEdit />
          </button>
        </div>
      )}

      <button
        onClick={() => setShowConfirm(true)}
        className="ml-3 text-red-600 text-xl focus:outline-none focus:ring-2 focus:ring-red-400 hover:text-red-700"
        aria-label="Delete group"
      >
        <MdOutlineDelete />
      </button>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this group?"
          onConfirm={onDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};
