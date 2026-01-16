// SortableGroup.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskGroup } from "../../../types";
import { TaskGroupCard } from "./TaskGroupCard/TaskGroupCard";
import { dndIds } from "../types/dndIds";

export const SortableGroup = ({ group }: { group: TaskGroup }) => {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({ id: dndIds.group(group.id), data: { kind: "group" } });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-60" : ""}
    >
      <TaskGroupCard
        group={group}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};
