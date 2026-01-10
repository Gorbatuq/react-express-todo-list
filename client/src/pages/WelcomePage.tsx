import { Link } from "react-router-dom";

export const WelcomePage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-violet-950 via-slate-900 to-fuchsia-950
      text-white px-6"
    >
      <div
        className="relative max-w-md w-full text-center space-y-8
        rounded-3xl border-2 border-violet-700
        bg-slate-900/80 px-8 py-10 shadow-2xl"
      >
        {/* Symbol */}
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2
          w-12 h-12 rounded-full bg-amber-400 text-slate-900
          flex items-center justify-center text-xl font-bold rotate-[-10deg]"
        >
          ✦
        </div>

        {/* Title */}
        <div className="space-y-3 pt-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Fin<span className="text-pink-400">Task</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            A calm adventure toward order and focus.
          </p>
        </div>

        {/* Values */}
        <ul className="space-y-3 text-left text-sm text-slate-200">
          <li className="flex gap-3">
            <span className="text-amber-400">★</span>
            No clutter. Only what matters.
          </li>
          <li className="flex gap-3">
            <span className="text-amber-400">★</span>
            Start instantly as a guest.
          </li>
          <li className="flex gap-3">
            <span className="text-amber-400">★</span>
            Your tasks, your rules.
          </li>
        </ul>

        {/* Action */}
        <div className="space-y-4">
          <Link
            to="/auth"
            className="block w-full rounded-2xl
              bg-amber-400 hover:bg-amber-300
              text-slate-900 font-semibold
              py-3 transition"
          >
            Start adventure
          </Link>

          <p className="text-xs text-slate-400">
            No account needed. Progress can be saved later.
          </p>
        </div>
      </div>
    </div>
  );
};
