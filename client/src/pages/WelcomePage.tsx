import { Link } from "react-router-dom";

export const WelcomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo / Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Fin<span className="text-sky-400">Task</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Minimal task management for people who value focus, structure and
            clarity.
          </p>
        </div>

        {/* Value points */}
        <ul className="space-y-3 text-left text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-sky-400">•</span>
            No clutter. Only what matters.
          </li>
          <li className="flex gap-2">
            <span className="text-sky-400">•</span>
            Guest mode available.
          </li>
          <li className="flex gap-2">
            <span className="text-sky-400">•</span>
            Your tasks. Your control.
          </li>
        </ul>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/auth"
            className="block w-full rounded-lg bg-sky-500 hover:bg-sky-600 transition py-3 font-semibold text-center"
          >
            Get started
          </Link>

          <p className="text-xs text-slate-500">
            You can continue as guest or create an account later.
          </p>
        </div>
      </div>
    </div>
  );
};
