import { z } from "zod";
import { AddItemForm } from "../ui/AddItemForm";
import { useGroupStore } from "@/store/groupStore";
import { MdFormatListBulletedAdd } from "react-icons/md";

const groupSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(25, "Maximum 25 characters")
    .regex(/[^\s]/, "Cannot be empty or whitespace only"),
});

export const AddGroupForm = () => {
  const createGroup = useGroupStore((s) => s.createGroup);

  return (
    <AddItemForm
      schema={groupSchema}
      fieldName="title"
      placeholder="Group title"
      onSubmit={async ({ title }) => await createGroup(title.trim())}
      className="flex justify-center gap-2 my-6"
      submitButton={
        <button
          type="submit"
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
