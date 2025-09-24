import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  authInputSchema,
  type AuthInputValues,
} from "@/validation/authSchemas";
import { useAuthMutations } from "@/features/taskGroup/hooks/queries/auth/useAuthMutations";

export const AuthPage = () => {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthInputValues>({
    resolver: zodResolver(authInputSchema),
  });

  const { login, register, guest } = useAuthMutations();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-700 to-slate-900">
      <form
        onSubmit={handleSubmit((data) => login.mutate(data))}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-slate-800">
          “It’s Tasking Time!”
        </h2>

        <div className="space-y-2">
          <input
            {...formRegister("email")}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <input
            {...formRegister("password")}
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
            disabled={login.isPending}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleSubmit((data) => register.mutate(data))}
            disabled={register.isPending}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md transition"
          >
            Register
          </button>
        </div>

        <button
          type="button"
          onClick={() => guest.mutate()}
          disabled={guest.isPending}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md transition"
        >
          Continue in the "guest"
        </button>
      </form>
    </div>
  );
};
