import { useState } from "react";
import { FiDisc, FiShuffle } from "react-icons/fi";
import { RandomTaskModal } from "./RandomTaskModal";
import { TaskWheelModal } from "./TaskWheelModal";

type ToolMode = "random" | "wheel";

export const TodoToolsFooter = () => {
  const [activeTool, setActiveTool] = useState<ToolMode | null>(null);

  return (
    <footer className="w-full min-w-0 border-t border-gray-200 bg-white px-4 py-8 dark:border-gray-600 dark:bg-zinc-800 sm:px-6 md:px-8">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-5 sm:flex-row sm:gap-8">
        <button
          type="button"
          onClick={() => setActiveTool("random")}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-8 py-4 text-base font-medium text-slate-500 transition-colors hover:border-slate-400 hover:bg-slate-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-700 sm:w-64"
        >
          <FiShuffle className="text-xl" />
          <span>Random</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTool("wheel")}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-8 py-4 text-base font-medium text-slate-500 transition-colors hover:border-slate-400 hover:bg-slate-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-700 sm:w-64"
        >
          <FiDisc className="text-xl" />
          <span>Wheel</span>
        </button>
      </div>

      {activeTool === "random" && (
        <RandomTaskModal onClose={() => setActiveTool(null)} />
      )}
      {activeTool === "wheel" && (
        <TaskWheelModal onClose={() => setActiveTool(null)} />
      )}
    </footer>
  );
};
