import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { taskSchema, type TaskInputValues } from "../../validation/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "../../../../types";
import { AutoResizeTextarea } from "../../../../shared/ui/AutoResizeTextarea";
import {
  TASK_TITLE_MAX_LENGTH,
  TEXT_LIMIT_WARNING_RATIO,
} from "../../constants/textLimits";

interface Props {
  task: Task;
  onSubmit: (title: string) => void;
}

export const EditableTaskTitle = ({ task, onSubmit }: Props) => {
  const [editing, setEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, reset, setFocus, getValues, trigger } =
    useForm<TaskInputValues>({
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

  useEffect(() => {
    if (!editing) return;

    const submitOnClickAway = async (event: PointerEvent) => {
      if (formRef.current?.contains(event.target as Node)) return;

      const isValid = await trigger("title");
      if (!isValid) return;

      submitHandler(getValues());
    };

    document.addEventListener("pointerdown", submitOnClickAway);
    return () => document.removeEventListener("pointerdown", submitOnClickAway);
  }, [editing, getValues, trigger]);

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
    <form
      ref={formRef}
      onSubmit={handleSubmit(submitHandler)}
      className="flex-1"
    >
      <AutoResizeTextarea
        {...register("title")}
        showOverflowFade={false}
        lengthWarningRatio={TEXT_LIMIT_WARNING_RATIO}
        minRows={1}
        maxRows={14}
        maxLength={TASK_TITLE_MAX_LENGTH}
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
        className="w-full rounded-md bg-white px-2 py-1 dark:bg-gray-700 dark:text-gray-100"
      />
    </form>
  );
};
