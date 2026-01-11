import { useNavigate, Navigate } from "react-router-dom";
import { useMe } from "../hooks/auth/useMe";
import { useAuthMutations } from "../hooks/auth/useAuthMutations";

export const ProfilePage = () => {
  const { data: user } = useMe();
  const { logout, forgotPassword } = useAuthMutations();
  const navigate = useNavigate();

  const registrationDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("cs-CZ")
    : "-";

  if (!user) return <Navigate to="/" replace />;

  const isGuest = user.role === "GUEST";
  const onResetPassword = () => {
    if (!user.email) return;
    forgotPassword.mutate(user.email);
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-zinc-800 flex justify-center items-start py-10 px-4">
      <section className="w-full max-w-md bg-white dark:bg-zinc-700 rounded-2xl shadow-xl p-8 space-y-6 transition-all duration-200">
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full bg-slate-300 dark:bg-zinc-600 flex items-center justify-center text-4xl">
            👤
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white break-words">
            {user.email || "Unknown user"}
          </h2>
        </div>

        <div className="border-t pt-4 space-y-3 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-zinc-300">
            <span>Data register:</span>
            <span className="font-medium text-slate-800 dark:text-white">
              {registrationDate}
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-zinc-300">
            <span>Stats task:</span>
            <span className="font-medium text-slate-800 dark:text-white">
              {user.taskCount ?? "-"}
            </span>
          </div>
        </div>

        {!isGuest && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onResetPassword}
              disabled={forgotPassword.isPending}
              className="w-full bg-slate-400 hover:bg-slate-500 text-white py-2 rounded-lg transition disabled:opacity-60"
            >
              Send reset password email
            </button>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-zinc-300">
              We’ll email you a link to set a new password.
            </p>
          </div>
        )}

        <div className="pt-2 flex justify-center gap-4 text-white">
          <button
            onClick={() => logout.mutate()}
            className="bg-red-500 hover:bg-red-600  px-4 py-2 rounded-lg transition"
          >
            Log out
          </button>
          <button
            onClick={() => navigate("/todo")}
            className="bg-slate-400 dark:bg-zinc-600 hover:bg-slate-500 dark:hover:bg-zinc-500 px-4 py-2 rounded-lg transition"
          >
            Back
          </button>
        </div>
      </section>
    </main>
  );
};
