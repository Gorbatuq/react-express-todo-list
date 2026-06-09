import { FiAward } from "react-icons/fi";
import type { TaskWithGroup } from "../../hooks/tasks/useTasksByGroups";

type Props = {
  isLoading: boolean;
  selectedTask: TaskWithGroup | null;
  tasksCount: number;
};

export const TaskChoiceResult = ({
  isLoading,
  selectedTask,
  tasksCount,
}: Props) => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-zinc-600 dark:bg-zinc-700/70 dark:text-zinc-300">
    {isLoading && "Loading tasks..."}
    {tasksCount === 0 && !isLoading && "No tasks in selected scope"}
    {!selectedTask && tasksCount > 0 && !isLoading && (
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 dark:bg-zinc-800 dark:text-zinc-400">
          <FiAward />
        </span>
        <span>Result will appear here</span>
      </div>
    )}
    {selectedTask && (
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-300">
          <FiAward />
        </span>
        <div className="min-w-0">
          <p className="break-words text-base font-semibold text-slate-900 dark:text-zinc-100">
            {selectedTask.title}
          </p>
          <p className="mt-1 break-words text-xs text-slate-500 dark:text-zinc-300">
            {selectedTask.groupTitle}
          </p>
        </div>
      </div>
    )}
  </div>
);
