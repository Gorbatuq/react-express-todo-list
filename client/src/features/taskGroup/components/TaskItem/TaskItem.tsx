import { Draggable } from "@hello-pangea/dnd";

import { TaskCheckbox } from "./TaskCheckbox";
import { EditableTaskTitle } from "./EditableTaskTitle";
import { DeleteButton } from "./DeleteButton";
import type { Task } from "@/types";

interface Props {
  task: Task;
  index: number;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEditSubmit: (taskId: string, title: string) => void;
}

export const TaskItem = ({
  task,
  index,
  onToggle,
  onDelete,
  onEditSubmit,
}: Props) => {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className={`flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 ${
            snapshot.isDragging ? "ring-2 ring-blue-50 shadow-xl" : ""
          }`}
        >
          <div className="flex items-center gap-3 rounded px-2 py-1 flex-1">
            <TaskCheckbox
              checked={task.completed}
              onChange={() => onToggle(task.id, !task.completed)}
            />
            <EditableTaskTitle
              task={task}
              onSubmit={(title) => onEditSubmit(task.id, title)}
            />
          </div>
          <DeleteButton onClick={() => onDelete(task.id)} />
        </li>
      )}
    </Draggable>
  );
};
