import { useEffect } from "react";
import { useTaskEditing } from "../../hooks/useTaskEditing";
import type { Task } from "../../model/types";

interface Props {
  task: Task;
  groupId: string;
  onSubmit: (title: string) => void;
}

export const EditableTaskTitle = ({ task, groupId, onSubmit }: Props) => {
  const { editing, title, startEditing, handleChange, handleSubmit, setTitle } =
    useTaskEditing({
      groupId,
      taskId: task._id,
      title: task.title,
      onSubmit,
    });

  useEffect(() => {
    if (!editing) {
      setTitle(task.title);
    }
  }, [task.title, editing, setTitle]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (!editing) {
    return (
      <span
        onClick={startEditing}
        className="break-words w-0 flex-1 cursor-pointer"
      >
        {task.title}
      </span>
    );
  }

  return (
    <input
      value={title}
      onChange={handleChange}
      onBlur={handleSubmit}
      onKeyDown={handleKeyDown}
      autoFocus
      className="flex-1 bg-white"
    />
  );
};
