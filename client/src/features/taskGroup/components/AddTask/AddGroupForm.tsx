import { MdFormatListBulletedAdd } from "react-icons/md";
import { useGroupMutations } from "../../hooks/queries/group/useGroupMutations";
import { groupSchema } from "@/validation/groupSchema";
import { useZodForm } from "../../hooks/useZodForm";

type Props = {
  isGuestLimited: boolean;
};

export const AddGroupForm = ({ isGuestLimited }: Props) => {
  const { createGroup } = useGroupMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(groupSchema);

  const submit = handleSubmit(async (data) => {
    await createGroup.mutateAsync(data);
    reset();
  });

  return (
    <div className="my-6 flex flex-col items-center gap-2">
      <form
        onSubmit={submit}
        className="flex gap-2 justify-center items-center"
      >
        <input
          {...register("title")}
          placeholder="Group title"
          disabled={isGuestLimited}
          className="border rounded px-3 py-2 w-64 dark:text-zinc-800 dark:bg-gray-700 "
        />
        <button
          type="submit"
          disabled={isGuestLimited || isSubmitting}
          className="px-4 py-2 rounded-xl bg-slate-400 dark:bg-zinc-100
            text-white dark:text-zinc-800 hover:bg-slate-700 transition-colors 
            duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdFormatListBulletedAdd />
        </button>
      </form>

      {typeof errors.title?.message === "string" && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}
      {isGuestLimited && (
        <p className="text-red-500 text-sm">Guest can create only 3 groups</p>
      )}
    </div>
  );
};
