import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthMutations } from "../hooks/auth/useAuthMutations";
import {
  passwordSchema,
  type passwordType,
} from "../shared/validation/authSchemas";
import { FormField } from "../shared/ui/FormField";

export const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuthMutations();

  const token = new URLSearchParams(location.search).get("token") ?? "";

  const form = useForm<passwordType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirm: "" },
  });

  const onSubmit = form.handleSubmit(({ newPassword }) => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    resetPassword.mutate(
      { token, newPassword },
      { onSuccess: () => navigate("/", { replace: true }) }
    );
  });

  return (
    <div className="flex items-center text-black justify-center min-h-screen bg-[url('/back-img-auth-forget.png')] bg-cover bg-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-4"
      >
        <h2 className="text-xl font-bold text-center pb-4 text-slate-800">
          Reset password
        </h2>

        <FormField
          type="password"
          placeholder="New password"
          registration={form.register("newPassword")}
          error={form.formState.errors.newPassword}
          autoComplete="new-password"
        />

        <FormField
          type="password"
          placeholder="Confirm password"
          registration={form.register("confirm")}
          error={form.formState.errors.confirm}
          autoComplete="new-password"
        />

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
