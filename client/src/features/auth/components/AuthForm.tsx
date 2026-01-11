import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  authInputSchema,
  type AuthInputValues,
} from "../../../shared/validation/authSchemas";
import { FormField } from "../../../shared/ui/FormField";

type MutationLike<T> = {
  mutate: (data: T) => void;
  isPending: boolean;
};

type Props = {
  login: MutationLike<AuthInputValues>;
  register: MutationLike<AuthInputValues>;
  guest: MutationLike<void>;
  onForgot: () => void;
};

export const AuthForm = ({ login, register, guest, onForgot }: Props) => {
  const form = useForm<AuthInputValues>({
    resolver: zodResolver(authInputSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => login.mutate(data))}
      className="space-y-4 pt-8"
    >
      <FormField
        registration={form.register("email")}
        error={form.formState.errors.email}
        placeholder="Email"
        autoComplete="email"
      />

      <FormField
        registration={form.register("password")}
        error={form.formState.errors.password}
        type="password"
        placeholder="Password"
        autoComplete="current-password"
      />

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
          onClick={form.handleSubmit((data) => register.mutate(data))}
          disabled={register.isPending}
          className="flex-1 rounded-md bg-sky-500 py-2 text-white transition hover:bg-sky-600 disabled:opacity-60"
        >
          Register
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onForgot}
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
  );
};
