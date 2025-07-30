import { PiPlus } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  addTask: (title: string) => Promise<void>;
}
const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(400, "Maximum 400 characters")
    .regex(/[^\s]/, "Cannot be empty or whitespace only"),
});

type TaskFormData = z.infer<typeof taskSchema>;

export const AddTaskForm = ({ addTask }: Props) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async ({ title }: TaskFormData) => {
    try {
      await addTask(title.trim());
      reset();
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <input
        {...register("title")}
        placeholder="New Task"
        className="flex-1 border rounded px-3 py-2 dark:text-zinc-800 "
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-400 hover:bg-green-500 text-white px-2 rounded"
      >
        <PiPlus />
      </button>
    </form>
  );
};
