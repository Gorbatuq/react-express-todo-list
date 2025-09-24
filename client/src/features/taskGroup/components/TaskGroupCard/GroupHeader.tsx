import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import type { Priority } from "@/types";

interface Props {
  title: string;
  priority: Priority;
  onSubmit: (title: string, priority: Priority) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

export const GroupHeader = ({ title, priority, onSubmit, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localPriority, setLocalPriority] = useState<Priority>(priority);
  const [showConfirm, setShowConfirm] = useState(false);

  const priorityColors: Record<Priority, string> = {
    1: "bg-red-500",
    2: "bg-orange-400",
    3: "bg-yellow-200",
    4: "bg-blue-100",
  };

  return (
    <div className="flex justify-between items-center mb-4">
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(localTitle.trim(), localPriority);
            setIsEditing(false);
          }}
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
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${priorityColors[priority]}`}
          />
          <span className="text-lg font-semibold break-words">{title}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 text-gray-500 hover:text-blue-600"
          >
            <MdOutlineEdit />
          </button>
        </div>
      )}
      <div className="relative">
        <button
          onClick={() => setShowConfirm(true)}
          className="ml-3 text-red-600 text-xl hover:text-red-700"
        >
          <MdOutlineDelete />
        </button>

        {showConfirm && (
          <ConfirmModal
            message="Are you sure you want to delete this group?"
            onConfirm={() => {
              onDelete();
              setShowConfirm(false);
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
    </div>
  );
};
