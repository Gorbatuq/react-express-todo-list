import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuthMutations } from "../features/taskGroup/hooks/queries/auth/useAuthMutations";

export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Min 8 chars")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[0-9]/, "At least one number"),

    confirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirm) {
      ctx.addIssue({
        path: ["confirm"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

type passwordType = z.infer<typeof passwordSchema>;

export const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuthMutations();

  const token = new URLSearchParams(location.search).get("token") ?? "";

  const form = useForm<passwordType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirm: "" },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    resetPassword.mutate(
      { token, newPassword: data.newPassword },
      { onSuccess: () => navigate("/", { replace: true }) }
    );
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/back-img-auth-forget.png')] bg-cover bg-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-4"
      >
        <h2 className="text-xl font-bold text-center pb-4 text-slate-800">
          Reset password
        </h2>

        <input
          type="password"
          placeholder="New password"
          {...form.register("newPassword")}
          className="w-full px-4 py-2 border rounded-md"
        />
        {form.formState.errors.newPassword && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.newPassword.message}
          </p>
        )}

        <input
          type="password"
          placeholder="Confirm password"
          {...form.register("confirm")}
          className="w-full px-4 py-2 border rounded-md"
        />
        {form.formState.errors.confirm && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.confirm.message}
          </p>
        )}

        <div className="flex pt-4 gap-2">
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={resetPassword.isPending || !token}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md disabled:opacity-60"
          >
            Submit
          </button>
        </div>

        {!token && (
          <p className="text-center text-sm text-red-600">Invalid reset link</p>
        )}
      </form>
    </div>
  );
};
