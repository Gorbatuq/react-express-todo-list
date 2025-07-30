import { MdFormatListBulletedAdd } from "react-icons/md";
import { useGroupStore } from "@/store/groupStore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const groupSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(25, "Maximum 25 characters")
    .regex(/[^\s]/, "Cannot be empty or whitespace only"),
});

type GroupFormData = z.infer<typeof groupSchema>;

export const AddGroupForm = () => {
  const createGroup = useGroupStore((s) => s.createGroup);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
  });

  const onSubmit = async ({ title }: GroupFormData) => {
    try {
      await createGroup(title.trim());
      reset();
    } catch (err) {
      console.error("Create group failed:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center gap-2 my-6"
    >
      <input
        {...register("title")}
        placeholder="Group title"
        className="border rounded-lg px-4 py-1 dark:text-zinc-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded-xl bg-slate-400 dark:bg-zinc-100
        text-white dark:text-zinc-800 hover:bg-slate-700 transition-colors 
        duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Add group"
      >
        <MdFormatListBulletedAdd />
      </button>
    </form>
  );
};
