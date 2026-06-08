import { useZodForm } from "../../hooks/useZodForm";
import { PiPlus } from "react-icons/pi";
import { useTaskMutations } from "../../hooks/queries/task/useTaskMutations";
import { taskSchema } from "../../validation/taskSchema";

interface Props {
  groupId: string;
}

export const AddTaskForm = ({ groupId }: Props) => {
  const { addTask } = useTaskMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(taskSchema);

  const onSubmit = handleSubmit(async ({ title }) => {
    try {
      await addTask.mutateAsync({ groupId, title: title.trim() });
      reset();
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <div className="mt-3 flex flex-col gap-2 w-full ">
      <form onSubmit={onSubmit} className="flex gap-2 items-center w-full ">
        <input
          {...register("title")}
          placeholder="Task title"
          className="app-input min-w-0 flex-1"
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
