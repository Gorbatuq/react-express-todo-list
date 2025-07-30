import { useZodForm } from "../../hooks/useZodForm";
import { PiPlus } from "react-icons/pi";
import type { z } from "zod";

interface Props {
  schema: z.ZodObject<any>;
  placeholder: string;
  fieldName: string;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  className?: string;
  submitButton?: React.ReactNode;
}

export const AddItemForm = ({
  schema,
  placeholder,
  fieldName,
  onSubmit,
  className,
  submitButton,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(schema);

  const submit = async (data: Record<string, any>) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className={className}>
      <input
        {...register(fieldName)}
        placeholder={placeholder}
        className={`border rounded px-3 py-2 dark:text-zinc-800 ${
          fieldName === "title" && placeholder === "Group title" ? "w-64" : ""
        }`}
      />
      {errors[fieldName]?.message && (
        <p className="text-red-500">{String(errors[fieldName].message)}</p>
      )}
      {submitButton ?? (
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-400 hover:bg-green-500 text-white px-2 rounded"
        >
          <PiPlus />
        </button>
      )}
    </form>
  );
};
