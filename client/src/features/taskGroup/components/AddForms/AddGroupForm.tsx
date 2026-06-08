import { MdFormatListBulletedAdd } from "react-icons/md";
import { useGroupMutations } from "../../hooks/groups/useGroupMutations";
import { useZodForm } from "../../../../shared/form/useZodForm";
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
          className="app-input w-64"
        />
        <button
          type="submit"
          aria-label="Add group"
          disabled={isDisabled}
          className="app-action-button app-action-button-neutral rounded-xl dark:bg-zinc-100 dark:text-zinc-800 dark:hover:bg-zinc-200"
        >
          <MdFormatListBulletedAdd />
        </button>
      </form>

      {/* message from below */}
      <div aria-live="polite" className="min-h-6">
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
