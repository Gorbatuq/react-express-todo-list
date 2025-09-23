import { z } from "zod";
import { AddItemForm } from "../ui/AddItemForm";
import { useGroupStore } from "@/store/groupStore";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { groupApi } from "@/api/groups";
import { useAuthStore } from "@/store/authStore";

const groupSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(25, "Maximum 25 characters")
    .regex(/[^\s]/, "Cannot be empty or whitespace only"),
});

export const AddGroupForm = () => {
  const createGroup = useGroupStore((s) => s.createGroup);
  const { isGuest } = useAuthStore();

  const { data: groups = [], isSuccess: groupsLoaded } = useQuery({
    queryKey: ["groups"],
    queryFn: groupApi.getAll,
  });

  const isGuestLimited = isGuest && groupsLoaded && groups.length >= 3;

  return (
    <AddItemForm
      schema={groupSchema}
      fieldName="title"
      placeholder="Group title"
      disabled={isGuestLimited}
      inputClassName="w-64"
      errorMessage={
        isGuestLimited
          ? "Guests can only create 3 groups. Please log in."
          : undefined
      }
      onSubmit={async ({ title }) => {
        if (isGuestLimited) return;
        await createGroup(title.trim());
      }}
      className="my-6"
      submitButton={
        <button
          type="submit"
          disabled={isGuestLimited}
          className="px-4 py-2 rounded-xl bg-slate-400 dark:bg-zinc-100
            text-white dark:text-zinc-800 hover:bg-slate-700 transition-colors 
            duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdFormatListBulletedAdd />
        </button>
      }
    />
  );
};
