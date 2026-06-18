import { Link } from "react-router-dom";
import PimRow from "./PimRow";

export default function FinalSection() {
  return (
    <section className="cartoon-surface cartoon-shadow-xl mt-24 rounded-3xl p-7 text-center text-slate-900 dark:text-zinc-100">
      <h2 className="text-lg font-extrabold">
        Make your productivity happy — with FinTask.
      </h2>
      <p className="mt-1 text-sm text-slate-700 dark:text-zinc-300">
        Yeeep! Now go do the thing. Or at least add it to the list.
      </p>

      <PimRow />

      <div className="mt-7">
        <Link
          to="/auth"
          className="cartoon-button w-full bg-amber-400 font-extrabold sm:w-auto"
        >
          Start the adventure
        </Link>
      </div>
    </section>
  );
}
