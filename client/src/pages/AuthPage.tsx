import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  authInputSchema,
  AuthInputValues,
} from "../shared/validation/authSchemas";
import { useAuthMutations } from "../hooks/auth/useAuthMutations";

export const AuthPage = () => {
  const [mode, setMode] = useState<"auth" | "forgot">("auth");
  const { login, register, guest, forgotPassword } = useAuthMutations();
  const navigate = useNavigate();

  const authForm = useForm<AuthInputValues>({
    resolver: zodResolver(authInputSchema),
  });

  const forgotForm = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });

  const onBack = () => {
    if (mode === "forgot") {
      setMode("auth");
      return;
    }
    navigate("/welcome", { replace: false });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[url('/back-img-auth.jpg')] bg-cover bg-center px-6">
      {/* Back (top-left, not a menu) */}
      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-sm text-white hover:bg-black/20 transition"
        aria-label="Back"
      >
        <span className="text-lg leading-none">←</span>
        <span>Back</span>
      </button>

      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-center text-2xl font-bold text-slate-800">
          “It’s Tasking Time!”
        </h2>

        {mode === "auth" ? (
          <form
            onSubmit={authForm.handleSubmit((data) => login.mutate(data))}
            className="space-y-4 pt-8"
          >
            <div className="space-y-2">
              <input
                {...authForm.register("email")}
                placeholder="Email"
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {authForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {authForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <input
                {...authForm.register("password")}
                type="password"
                placeholder="Password"
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {authForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {authForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between gap-3">
              <button
                type="submit"
                disabled={login.isPending}
                className="flex-1 rounded-md bg-green-500 py-2 text-white transition hover:bg-green-600 disabled:opacity-60"
              >
                Login
              </button>

              <button
                type="button"
                onClick={authForm.handleSubmit((data) => register.mutate(data))}
                disabled={register.isPending}
                className="flex-1 rounded-md bg-sky-500 py-2 text-white transition hover:bg-sky-600 disabled:opacity-60"
              >
                Register
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="w-full rounded-md bg-gray-200 py-2 text-black transition hover:bg-gray-300"
              >
                Forgot password
              </button>

              <button
                type="button"
                onClick={() => guest.mutate()}
                disabled={guest.isPending}
                className="w-full rounded-md bg-gray-500 py-2 text-white transition hover:bg-gray-600 disabled:opacity-60"
              >
                Continue as guest
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={forgotForm.handleSubmit((data) => {
              forgotPassword.mutate(data.email);
              forgotForm.reset();
            })}
            className="space-y-4 pt-4"
          >
            <p className="text-center text-sm text-slate-600">
              Enter your email. We’ll send you a reset link.
            </p>

            <div className="space-y-2">
              <input
                {...forgotForm.register("email")}
                placeholder="Email"
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {forgotForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {forgotForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={forgotPassword.isPending}
              className="w-full rounded-md bg-sky-500 py-2 text-white transition hover:bg-sky-600 disabled:opacity-60"
            >
              Send reset link
            </button>

            <button
              type="button"
              onClick={() => setMode("auth")}
              className="w-full rounded-md bg-gray-200 py-2 text-black transition hover:bg-gray-300"
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
