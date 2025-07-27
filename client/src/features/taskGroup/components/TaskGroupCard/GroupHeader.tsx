import { useEffect, useState } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { MdOutlineDelete } from "react-icons/md";

interface Props {
  groupId: string;
  title: string;
  isEditing: boolean;
  setEditingGroupId: (id: string | null) => void;
  handleGroupEditSubmit: (title: string) => Promise<void>;
  handleDeleteGroup: () => Promise<void>;
}

export const GroupHeader = ({
  groupId,
  title,
  isEditing,
  setEditingGroupId,
  handleGroupEditSubmit,
  handleDeleteGroup,
}: Props) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isEditing) setLocalTitle(title);
  }, [isEditing, title]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = localTitle.trim();
    if (!trimmed) return;
    await handleGroupEditSubmit(trimmed);
    setEditingGroupId(null);
  };

  const onDelete = async () => {
    await handleDeleteGroup();
    setShowConfirm(false);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      {isEditing ? (
        <form onSubmit={onFormSubmit} className="flex-1">
          <input
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            autoFocus
            className="w-full border rounded px-2 py-1"
          />
        </form>
      ) : (
        <span
          className="text-lg font-semibold cursor-pointer truncate max-w-full break-words"
          onClick={() => setEditingGroupId(groupId)}
        >
          - {title} -
        </span>
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
