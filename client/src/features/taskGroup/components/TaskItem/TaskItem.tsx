import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../../model/types";
import { TaskCheckbox } from "./TaskCheckbox";
import { EditableTaskTitle } from "./EditableTaskTitle";
import { DeleteButton } from "./DeleteButton";

interface Props {
  task: Task;
  groupId: string;
  index: number;
  onToggle: (groupId: string, taskId: string) => void;
  onDelete: (groupId: string, taskId: string) => void;
  onEditSubmit: (groupId: string, taskId: string, title: string) => void;
}

export const TaskItem = ({
  task,
  groupId,
  index,
  onToggle,
  onDelete,
  onEditSubmit,
}: Props) => {
  return (
    <Draggable draggableId={String(task._id)} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className={`flex items-center justify-between bg-gray-100 dark:bg-gray-500 rounded-lg px-3 py-2 ${
            snapshot.isDragging ? "ring-2 ring-blue-50 shadow-xl" : ""
          }`}
        >
          <div className="flex items-center gap-3 rounded px-2 py-1 flex-1">
            <TaskCheckbox
              checked={task.completed}
              onChange={() => onToggle(groupId, task._id)}
            />
            <EditableTaskTitle
              task={task}
              onSubmit={(title) => onEditSubmit(groupId, task._id, title)}
            />
          </div>
          <DeleteButton onClick={() => onDelete(groupId, task._id)} />
        </li>
      )}
    </Draggable>
  );
};
