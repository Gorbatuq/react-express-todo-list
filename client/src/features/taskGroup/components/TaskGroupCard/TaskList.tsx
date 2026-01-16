import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../../../types";
import { TaskItem } from "../TaskItem/TaskItem";
import { dndIds } from "../../types/dndIds";

export const TaskList = ({
  groupId,
  tasks,
  onToggle,
  onDelete,
  onEditSubmit,
}: {
  groupId: string;
  tasks: Task[];
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEditSubmit: (taskId: string, title: string) => void;
}) => {
  const { setNodeRef } = useDroppable({ id: dndIds.container(groupId) });

  return (
    <SortableContext
      items={tasks.map((t) => dndIds.task(t.id))}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="flex flex-col gap-2 mb-4">
        {tasks.map((task) => (
          <SortableTaskItem
            key={task.id}
            task={task}
            groupId={groupId}
            onToggle={onToggle}
            onDelete={onDelete}
            onEditSubmit={onEditSubmit}
          />
        ))}
      </div>
    </SortableContext>
  );
};

const SortableTaskItem = ({
  task,
  groupId,
  onToggle,
  onDelete,
  onEditSubmit,
}: {
  task: Task;
  groupId: string;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEditSubmit: (taskId: string, title: string) => void;
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: dndIds.task(task.id),
    data: { groupId }, // без проп-дрилінгу в TaskItem
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 ${
        isDragging ? "ring-2 ring-blue-50 shadow-xl opacity-70" : ""
      }`}
    >
      <TaskItem
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        onEditSubmit={onEditSubmit}
      />
    </li>
  );
};
