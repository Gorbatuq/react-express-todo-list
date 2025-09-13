import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";

const authInputSchema = z.object({
  email: z.string().min(4, "Email must be at least 4 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type AuthInputValues = z.infer<typeof authInputSchema>;

export const AuthPage = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthInputValues>({
    resolver: zodResolver(authInputSchema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["me"] });
    reset();
    navigate("/todo");
  };

  const withErrorHandling = async (
    fn: () => Promise<void>,
    errorMsg: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      await fn();
      onSuccess();
    } catch {
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (data: AuthInputValues) =>
    withErrorHandling(
      () => authApi.login(data.email, data.password),
      "Invalid data or server error"
    );

  const handleRegister = (data: AuthInputValues) =>
    withErrorHandling(
      () => authApi.register(data.email, data.password),
      "User already exists or server error"
    );

  const handleGuest = () =>
    withErrorHandling(
      () => authApi.createGuest(),
      "Unable to create temporary user"
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-700 to-slate-900">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-slate-800">
          Register for ToDo
        </h2>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div className="space-y-2">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-between gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleSubmit(handleRegister)}
            disabled={loading}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md transition"
          >
            Sign Up
          </button>
        </div>

        <button
          type="button"
          onClick={handleGuest}
          disabled={loading}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md transition"
        >
          Continue in the ghost
        </button>
      </form>
    </div>
  );
};
