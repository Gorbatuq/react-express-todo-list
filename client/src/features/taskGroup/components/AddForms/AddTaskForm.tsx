import { taskSchema } from "@/features/taskGroup/validation/taskSchema";
import { useZodForm } from "../../hooks/useZodForm";
import { PiPlus } from "react-icons/pi";
import { useTaskMutations } from "../../hooks/queries/task/useTaskMutations";

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

  const submit = handleSubmit(async ({ title }) => {
    await addTask.mutateAsync({ groupId, title: title.trim() });
    reset();
  });

  return (
    <div className="mt-3 flex flex-col gap-2 w-full overflow-hidden">
      <form
        onSubmit={submit}
        className="flex gap-2 items-center w-full overflow-hidden"
      >
        <input
          {...register("title")}
          placeholder="Task title"
          className="flex-1 min-w-0 px-3 py-2 rounded-md
                 border border-gray-300 text-gray-900 dark:focus:outline-none
                 dark:bg-zinc-700 dark:text-gray-100 "
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 px-3 py-2 rounded-md bg-green-500 text-white 
                 hover:bg-green-600 transition-colors duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed"
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
