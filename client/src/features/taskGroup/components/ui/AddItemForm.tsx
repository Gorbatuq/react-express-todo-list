import { useZodForm } from "../../hooks/useZodForm";
import { PiPlus } from "react-icons/pi";
import type { z } from "zod";

interface Props {
  schema: z.ZodObject<any>;
  placeholder: string;
  fieldName: string;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  className?: string;
  disabled?: boolean;
  errorMessage?: string;
  submitButton?: React.ReactNode;
}

export const AddItemForm = ({
  schema,
  placeholder,
  fieldName,
  onSubmit,
  className,
  submitButton,
  errorMessage,
  disabled,
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
      <div className="flex justify-center gap-2">
        <input
          {...register(fieldName)}
          placeholder={placeholder}
          disabled={disabled}
          className={`border rounded px-3 py-2 dark:text-zinc-800 ${
            fieldName === "title" && placeholder === "Group title" ? "w-64" : ""
          }`}
        />

        {submitButton ?? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-400 hover:bg-green-500 text-white px-2 rounded"
          >
            <PiPlus />
          </button>
        )}
      </div>

      <div className="mt-1 text-center">
        {typeof errors[fieldName]?.message === "string" && (
          <p className="text-red-500 text-sm">{errors[fieldName]?.message}</p>
        )}
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </div>
    </form>
  );
};
