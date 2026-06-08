import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { MdContentCopy, MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { TbGripVertical } from "react-icons/tb";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { PRIORITY_COLORS, type Priority } from "../../../../types";
import { IconButton } from "../../../../shared/ui/IconButton";
import { PrioritySelect } from "../../../../shared/ui/PrioritySelect";

interface Props {
  title: string;
  priority: Priority;
  onSubmit: (title: string, priority: Priority) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
  onCopy: () => void | Promise<void>;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export const GroupHeader = ({
  title,
  priority,
  onSubmit,
  onDelete,
  onCopy,
  dragHandleProps,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localPriority, setLocalPriority] = useState<Priority>(priority);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="mb-4 flex items-center gap-2">
      {!isEditing && (
        <div
          {...dragHandleProps}
          role="button"
          tabIndex={0}
          aria-label="Drag group"
          className="app-icon-button app-icon-button-muted h-7 w-5 flex-shrink-0
                     text-gray-500 hover:text-gray-900 hover:bg-gray-100
                     dark:text-gray-300 dark:hover:text-white dark:hover:bg-zinc-700
                     cursor-grab active:cursor-grabbing select-none touch-none"
        >
          <TbGripVertical className="text-base" />
        </div>
      )}

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
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
              className="app-input px-2 py-1"
            />
            <PrioritySelect
              value={localPriority}
              onChange={setLocalPriority}
              className="px-2 py-1"
            />

            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 dark:text-zinc-700"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 ${PRIORITY_COLORS[priority]}`}
            />
            <span className="text-lg font-semibold truncate">{title}</span>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="relative flex flex-shrink-0 items-center gap-px">
          <IconButton
            onClick={() => setIsEditing(true)}
            aria-label="Edit group"
            icon={<MdOutlineEdit className="text-base" />}
            sizeClassName="h-7 w-7"
          />

          <IconButton
            onClick={onCopy}
            aria-label="Copy group tasks"
            icon={<MdContentCopy className="text-base" />}
            sizeClassName="h-7 w-7"
          />

          <IconButton
            onClick={() => setShowConfirm(true)}
            aria-label="Delete group"
            icon={<MdOutlineDelete className="text-base" />}
            sizeClassName="h-7 w-7"
            variant="danger"
          />

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
      )}
    </div>
  );
};
