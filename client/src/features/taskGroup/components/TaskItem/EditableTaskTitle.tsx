import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { taskSchema, type TaskInputValues } from "../../validation/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { Task } from "../../../../types";

interface Props {
  task: Task;
  onSubmit: (title: string) => void;
}

export const EditableTaskTitle = ({ task, onSubmit }: Props) => {
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset, setFocus } = useForm<TaskInputValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: task.title },
  });

  const submitHandler = ({ title }: TaskInputValues) => {
    if (title !== task.title) {
      onSubmit(title);
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
        className="break-words w-0 flex-1 cursor-pointer whitespace-pre-wrap"
      >
        {task.title}
      </span>
    );
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex-1">
      <TextareaAutosize
        {...register("title")}
        minRows={1}
        maxRows={6}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(submitHandler)();
          }
          if (e.key === "Escape") {
            reset({ title: task.title });
            setEditing(false);
          }
        }}
        autoFocus
        className="w-full bg-white dark:text-zinc-800 resize-none overflow-hidden"
      />
    </form>
  );
};
