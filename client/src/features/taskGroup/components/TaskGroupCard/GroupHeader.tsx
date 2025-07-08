import React, { useState } from "react";
import type { EditingGroup } from "./TaskGroupCard.types";
import { ConfirmModal } from "./ConfirmModal";

interface Props {
  groupId: string;
  title: string;
  isEditing: boolean;
  editingGroup: EditingGroup | null;
  setEditingGroup: React.Dispatch<React.SetStateAction<EditingGroup | null>>;
  handleGroupEditSubmit: () => Promise<void>;
  handleDeleteGroup: () => Promise<void>;
}

export const GroupHeader = ({
  groupId,
  title,
  isEditing,
  editingGroup,
  setEditingGroup,
  handleGroupEditSubmit,
  handleDeleteGroup,
}: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingGroup({ id: groupId, title: e.target.value });
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGroupEditSubmit();
  };

  const onDelete = () => {
    handleDeleteGroup();
    setShowConfirm(false);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      {isEditing ? (
        <form onSubmit={onFormSubmit} className="flex-1">
          <input
            value={editingGroup?.title || ""}
            onChange={onInputChange}
            autoFocus
            className="w-full border rounded px-2 py-1"
          />
        </form>
      ) : (
        <span
          className="text-lg font-semibold cursor-pointer truncate max-w-full break-words"
          onClick={() => setEditingGroup({ id: groupId, title })}
        >
          - {title} -
        </span>
      )}
      <button
        onClick={() => setShowConfirm(true)}
        className="ml-3 text-red-600 text-xl focus:outline-none focus:ring-2 focus:ring-red-400"
        aria-label="Delete group"
      >
        ×
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
