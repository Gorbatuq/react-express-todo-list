import React from "react";
import type { EditingGroup } from "./TaskGroupCard.types";

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
}: Props) => (
  <div className="flex justify-between items-center mb-4">
    {isEditing ? (
      <input
        value={editingGroup?.title || ""}
        onChange={(e) =>
          setEditingGroup({ id: groupId, title: e.target.value })
        }
        onBlur={handleGroupEditSubmit}
        onKeyDown={(e) => e.key === "Enter" && handleGroupEditSubmit()}
        autoFocus
        className="flex-1 border rounded px-2 py-1"
      />
    ) : (
      <span
        className="text-lg font-semibold cursor-pointer truncate max-w-full break-words"
        onClick={() => setEditingGroup({ id: groupId, title })}
      >
        - {title} -
      </span>
    )}
    <button onClick={handleDeleteGroup} className="ml-3 text-red-600 text-xl">
      ×
    </button>
  </div>
);
