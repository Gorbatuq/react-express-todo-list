import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { TaskCheckbox } from "./TaskCheckbox";
import { EditableTaskTitle } from "./EditableTaskTitle";
import { DeleteButton } from "./DeleteButton";
import { Task } from "../../../../types";
import { getDropAnimationStyle } from "../../utils/getDropAnimationStyle";

interface Props {
  task: Task;
  index: number;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEditSubmit: (taskId: string, title: string) => void;
}

export const TaskItem = React.memo(({
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
          style={getDropAnimationStyle(
            provided.draggableProps.style,
            snapshot,
          )}
          className={`task-item-surface flex items-center justify-between ${
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
});
