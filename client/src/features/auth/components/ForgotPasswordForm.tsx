import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField } from "../../../shared/ui/FormField";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

type MutationLike<T> = {
  mutate: (data: T) => void;
  isPending: boolean;
};

type Props = {
  forgotPassword: MutationLike<string>;
  onBackToLogin: () => void;
};

export const ForgotPasswordForm = ({
  forgotPassword,
  onBackToLogin,
}: Props) => {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <form
      onSubmit={form.handleSubmit(({ email }) => {
        forgotPassword.mutate(email);
        form.reset();
      })}
      className="space-y-4 pt-4"
    >
      <p className="text-center text-sm text-slate-600">
        Enter your email. We’ll send you a reset link.
      </p>

      <FormField
        registration={form.register("email")}
        error={form.formState.errors.email}
        placeholder="Email"
        autoComplete="email"
      />

      <button
        type="submit"
        disabled={forgotPassword.isPending}
        className="w-full rounded-md bg-sky-500 py-2 text-white transition hover:bg-sky-600 disabled:opacity-60"
      >
        Send reset link
      </button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full rounded-md bg-gray-200 py-2 text-black transition hover:bg-gray-300"
      >
        Back to login
      </button>
    </form>
  );
};
