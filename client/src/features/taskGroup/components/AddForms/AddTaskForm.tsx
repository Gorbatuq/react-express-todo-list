import { useZodForm } from "../../../../shared/form/useZodForm";
import { PiPlus } from "react-icons/pi";
import { useTaskMutations } from "../../hooks/tasks/useTaskMutations";
import { taskSchema } from "../../validation/taskSchema";
import { AutoResizeTextarea } from "../../../../shared/ui/AutoResizeTextarea";
import {
  TASK_TITLE_MAX_LENGTH,
  TEXT_LIMIT_WARNING_RATIO,
} from "../../constants/textLimits";

interface Props {
  groupId: string;
}

export const AddTaskForm = ({ groupId }: Props) => {
  const { addTask } = useTaskMutations();
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useZodForm(taskSchema);

  const onSubmit = handleSubmit(async ({ title }) => {
    try {
      await addTask.mutateAsync({ groupId, title: title.trim() });
      reset({ title: "" });
      clearErrors();
    } catch (err) {
      console.error(err);
    }
  });
  const titleRegistration = register("title");

  return (
    <div className="mt-3 flex flex-col gap-2 w-full ">
      <form onSubmit={onSubmit} className="flex gap-2 items-end w-full ">
        <AutoResizeTextarea
          {...titleRegistration}
          wrapperClassName="min-w-0 flex-1"
          showOverflowFade={false}
          showLengthWarning={!errors.title}
          lengthWarningRatio={TEXT_LIMIT_WARNING_RATIO}
          minRows={1}
          maxRows={14}
          maxLength={TASK_TITLE_MAX_LENGTH}
          placeholder="Task title"
          onChange={(event) => {
            titleRegistration.onChange(event);
            clearErrors("title");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          className="app-input w-full"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="app-action-button app-action-button-success shrink-0 rounded-md px-3"
        >
          <PiPlus className="text-lg" />
        </button>
      </form>

      {/* message from below */}
      {typeof errors.title?.message === "string" && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}
    </div>
  );
};
