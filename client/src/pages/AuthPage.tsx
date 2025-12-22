import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthMutations } from "../features/taskGroup/hooks/queries/auth/useAuthMutations";
import {
  authInputSchema,
  AuthInputValues,
} from "../shared/validation/authSchemas";

export const AuthPage = () => {
  const [mode, setMode] = useState<"auth" | "forgot">("auth");
  const { login, register, guest, forgotPassword } = useAuthMutations();

  const authForm = useForm<AuthInputValues>({
    resolver: zodResolver(authInputSchema),
  });

  const forgotForm = useForm({
    defaultValues: { email: "" },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/back-img-auth.jpg')] bg-cover bg-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 ">
        <h2 className="text-2xl font-bold text-center text-slate-800">
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
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {authForm.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {authForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <input
                {...authForm.register("password")}
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {authForm.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {authForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between gap-3">
              <button
                type="submit"
                disabled={login.isPending}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition disabled:opacity-60"
              >
                Login
              </button>

              <button
                type="button"
                onClick={authForm.handleSubmit((data) => register.mutate(data))}
                disabled={register.isPending}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md transition disabled:opacity-60"
              >
                Register
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-md transition"
              >
                Forgot password
              </button>

              <button
                type="button"
                onClick={() => guest.mutate()}
                disabled={guest.isPending}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md transition disabled:opacity-60"
              >
                Continue as guest
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={forgotForm.handleSubmit((data) => {
              forgotPassword.mutate(data.email), forgotForm.reset();
            })}
            className="space-y-4 pt-4"
          >
            <p className="text-sm text-center text-slate-600">
              Enter your email. We’ll send you a reset link.
            </p>

            <div className="space-y-2">
              <input
                {...forgotForm.register("email")}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {forgotForm.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {forgotForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={forgotPassword.isPending}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md transition disabled:opacity-60"
            >
              Send reset link
            </button>

            <button
              type="button"
              onClick={() => setMode("auth")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-md transition"
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
