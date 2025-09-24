import { taskSchema } from "@/validation/taskSchema";
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
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input
        {...register("title")}
        placeholder="Task title"
        className="border rounded px-3 py-2 flex-1 min-w-0 dark:text-zinc-800"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-400 hover:bg-green-500 text-white px-2 rounded"
      >
        <PiPlus />
      </button>
      {typeof errors.title?.message === "string" && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}
    </form>
  );
};
