import { TaskCheckbox } from "./TaskCheckbox";
import { EditableTaskTitle } from "./EditableTaskTitle";
import { DeleteButton } from "./DeleteButton";
import type { Task } from "../../../../types";

export const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onEditSubmit,
}: {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEditSubmit: (taskId: string, title: string) => void;
}) => {
  return (
    <>
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
    </>
  );
};
