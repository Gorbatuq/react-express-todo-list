import { useTaskEditing } from "../../hooks/useTaskEditing";
import type { Task } from "../../model/types";

export const EditableTaskTitle = ({
  task,
  groupId,
  onSubmit,
}: {
  task: Task;
  groupId: string;
  onSubmit: (groupId: string, taskId: string, title: string) => void;
}) => {
  const { editing, title, startEditing, handleChange, handleSubmit } =
    useTaskEditing({
      groupId,
      taskId: task._id,
      title: task.title,
      onSubmit,
    });

  if (!editing)
    return (
      <span
        onClick={startEditing}
        className="break-words w-0 flex-1 cursor-pointer"
      >
        {task.title}
      </span>
    );

  return (
    <input
      value={title}
      onChange={handleChange}
      onBlur={handleSubmit}
      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      autoFocus
      className="flex-1 bg-white"
    />
  );
};
