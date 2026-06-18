import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HERO_STATS } from "../content";

export default function HeroSection() {
  return (
    <section className="cartoon-surface cartoon-shadow-xl relative overflow-hidden rounded-3xl p-6 text-slate-900 dark:text-zinc-100 sm:p-8">
      <div className="cartoon-surface cartoon-shadow-lg absolute -right-8 -top-10 h-28 w-28 rotate-12 rounded-3xl bg-amber-400/60" />
      <div className="cartoon-surface cartoon-shadow-lg absolute -left-10 bottom-4 -z-10 h-24 w-24 -rotate-6 rounded-3xl bg-slate-100 dark:bg-zinc-700" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <div className="cartoon-surface cartoon-shadow-sm inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold">
            FIN & Jake
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-extrabold">
              ENTERTAINMENT
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome to FinTask
          </h2>
          <h1 className="mt-2 text-lg font-semibold">
            Maybe the best TODO list ever.
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
            (Maybe. The Scroll of Truth is still loading.)
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/auth"
              className="cartoon-button bg-amber-400 font-extrabold"
            >
              Start the adventure
            </Link>
            <Link
              to="/auth"
              className="cartoon-button bg-white font-bold dark:bg-zinc-700 dark:text-zinc-100"
            >
              Login / Register
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="cartoon-surface cartoon-shadow-md rounded-2xl p-3"
              >
                <div className="text-sm font-extrabold">{s.label}</div>
                <div className="text-xs text-slate-600 dark:text-zinc-300">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <motion.div
            className="cartoon-surface cartoon-shadow-xl group relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl"
            initial={{ opacity: 0, y: 16, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: -2.4 }}
            whileHover={{ y: -6, rotate: -1.2 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <motion.div
              className="pointer-events-none absolute -inset-24 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 blur-md"
              initial={{ x: -260 }}
              whileHover={{ x: 260, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            />

            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="absolute inset-0 bg-white/5" />
            </div>

            <div className="relative aspect-video w-full">
              <img
                src="/jake.png"
                alt="FinTask preview"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
