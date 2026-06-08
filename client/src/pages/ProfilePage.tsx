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
    <main className="flex min-h-screen items-start justify-center bg-slate-100 px-4 py-10 dark:bg-zinc-800">
      <section className="app-card w-full max-w-md space-y-6 p-8">
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
              className="app-action-button app-action-button-neutral w-full"
            >
              Send reset password email
            </button>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-zinc-300">
              We’ll email you a link to set a new password.
            </p>
          </div>
        )}

        <div className="flex justify-center gap-4 pt-2 text-white">
          <button
            type="button"
            onClick={() => logout.mutate()}
            className="app-action-button app-action-button-danger"
          >
            Log out
          </button>
          <button
            type="button"
            onClick={() => navigate("/todo")}
            className="app-action-button app-action-button-neutral"
          >
            Back
          </button>
        </div>
      </section>
    </main>
  );
};
