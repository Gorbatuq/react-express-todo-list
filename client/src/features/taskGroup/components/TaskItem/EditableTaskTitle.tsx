import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type { Task } from "../../model/types";

interface Props {
  task: Task;
  onSubmit: (title: string) => void;
}

export const EditableTaskTitle = ({ task, onSubmit }: Props) => {
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset, setFocus } = useForm<{
    title: string;
  }>({
    defaultValues: { title: task.title },
  });

  const submitHandler = ({ title }: { title: string }) => {
    const trimmed = title.trim();
    if (trimmed !== task.title.trim()) {
      onSubmit(trimmed);
    }
    setEditing(false);
  };

  useEffect(() => {
    if (editing) setFocus("title");
  }, [editing, setFocus]);

  if (!editing) {
    return (
      <span
        onClick={() => setEditing(true)}
        className="break-words w-0 flex-1 cursor-pointer"
      >
        {task.title}
      </span>
    );
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex-1">
      <input
        {...register("title")}
        onBlur={handleSubmit(submitHandler)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            reset({ title: task.title });
            setEditing(false);
          }
        }}
        autoFocus
        className="w-full bg-white dark:text-zinc-800"
      />
    </form>
  );
};
