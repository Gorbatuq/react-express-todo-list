import { MdFormatListBulletedAdd } from "react-icons/md";
import { useGroupMutations } from "../../hooks/queries/group/useGroupMutations";
import { useZodForm } from "../../hooks/useZodForm";
import { groupSchema } from "../../validation/groupSchema";
import toast from "react-hot-toast";

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

  const isDisabled = isGuestLimited || isSubmitting;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createGroup.mutateAsync(data);
      reset();
    } catch (err) {
      toast.error("Failed to create group");
    }
  });

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <form
        onSubmit={onSubmit}
        className="flex gap-2 justify-center items-center"
      >
        <input
          {...register("title")}
          placeholder="Group title"
          disabled={isDisabled}
          className="border rounded px-3 py-2 w-64 hover:bg-zinc-50 dark:text-zinc-800 dark:bg-gray-700 "
        />
        <button
          type="submit"
          aria-label="Add group"
          disabled={isDisabled}
          className="px-4 py-2 rounded-xl bg-slate-400 dark:bg-zinc-100
            text-white dark:text-zinc-800 hover:bg-slate-700 transition-colors 
            duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdFormatListBulletedAdd />
        </button>
      </form>

      {/* message from below */}
      <div aria-live="polite" className="min-h-[1.5rem]">
        {typeof errors.title?.message === "string" && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
        {isGuestLimited && (
          <p className="text-red-500 text-sm">Guest can create only 3 groups</p>
        )}
      </div>
    </div>
  );
};
