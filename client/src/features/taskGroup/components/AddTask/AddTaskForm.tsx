import { z } from "zod";
import { AddItemForm } from "../ui/AddItemForm";

const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(400, "Maximum 400 characters")
    .regex(/[^\s]/, "Cannot be empty or whitespace only"),
});

interface Props {
  addTask: (title: string) => Promise<void>;
}

export const AddTaskForm = ({ addTask }: Props) => {
  return (
    <AddItemForm
      schema={taskSchema}
      fieldName="title"
      placeholder="New Task"
      onSubmit={async ({ title }) => {
        await addTask(title.trim());
      }}
    />
  );
};
