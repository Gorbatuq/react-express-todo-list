import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { MdPlaylistAdd } from "react-icons/md";
import { useMe } from "../../../auth/hooks/useMe";
import { useGroups } from "../../hooks/groups/useGroups";
import { useGroupMutations } from "../../hooks/groups/useGroupMutations";
import { useTaskMutations } from "../../hooks/tasks/useTaskMutations";
import { DEFAULT_PRIORITY, type Priority } from "../../../../types";
import { PrioritySelect } from "../../../../shared/ui/PrioritySelect";
import { AutoResizeTextarea } from "../../../../shared/ui/AutoResizeTextarea";
import {
  BULK_TASK_IMPORT_MAX_LENGTH,
  TEXT_LIMIT_WARNING_RATIO,
} from "../../constants/textLimits";

const parseTaskTitles = (value: string) => {
  const hasHardSeparators = /[,;\n\r]/.test(value);
  const separator = hasHardSeparators ? /[,;\n\r]+/ : /\s+/;

  return Array.from(
    new Set(
      value
        .split(separator)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
};

export const BulkTaskImportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");
  const [rawTasks, setRawTasks] = useState("");
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY);
  const [error, setError] = useState("");

  const { data: groups } = useGroups();
  const { data: user } = useMe();
  const { createGroup } = useGroupMutations();
  const { addTask } = useTaskMutations();

  const taskTitles = useMemo(() => parseTaskTitles(rawTasks), [rawTasks]);
  const isGuestLimited = user?.role === "GUEST" && (groups?.length ?? 0) >= 3;
  const isSubmitting = createGroup.isPending || addTask.isPending;

  const clearError = () => {
    if (error) setError("");
  };

  const resetForm = () => {
    setGroupTitle("");
    setRawTasks("");
    setPriority(DEFAULT_PRIORITY);
    setError("");
  };

  const closeModal = () => {
    if (isSubmitting) return;
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const title = groupTitle.trim();
    const invalidTask = taskTitles.find((taskTitle) => taskTitle.length < 3);

    if (title.length < 3) {
      setError("Group title must be at least 3 characters");
      return;
    }

    if (taskTitles.length === 0) {
      setError("Add at least one task");
      return;
    }

    if (rawTasks.length > BULK_TASK_IMPORT_MAX_LENGTH) {
      setError(`Tasks input must be at most ${BULK_TASK_IMPORT_MAX_LENGTH} characters`);
      return;
    }

    if (invalidTask) {
      setError(`Task "${invalidTask}" is shorter than 3 characters`);
      return;
    }

    try {
      const group = await createGroup.mutateAsync({ title, priority });

      await Promise.all(
        taskTitles.map((taskTitle) =>
          addTask.mutateAsync({ groupId: group.id, title: taskTitle }),
        ),
      );

      toast.success(`Imported ${taskTitles.length} tasks`);
      resetForm();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to import tasks");
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Import tasks"
        disabled={isGuestLimited}
        onClick={() => setIsOpen(true)}
        className="mt-5 inline-flex h-6 w-6 items-center justify-center rounded-full border
          border-slate-300 bg-white text-gray-900 transition-all duration-300
          hover:scale-105 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50
          text-lg dark:border-slate-600 dark:bg-gray-700 dark:text-gray-200
          sm:mt-0 sm:h-11 sm:w-11 sm:border-2 sm:text-3xl"
      >
        <MdPlaylistAdd />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onMouseDown={closeModal}
          aria-hidden="true"
        />
      )}

      {isOpen && (
        <div
          className="fixed inset-x-4 top-20 z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-800 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-96"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Import tasks
              </h2>
              <button
                type="button"
                aria-label="Close import tasks"
                onClick={closeModal}
                disabled={isSubmitting}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-zinc-700 dark:hover:text-white"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <input
              value={groupTitle}
              onChange={(event) => {
                setGroupTitle(event.target.value);
                clearError();
              }}
              placeholder="Group title"
              disabled={isSubmitting}
              className="app-input w-full"
            />

            <PrioritySelect
              value={priority}
              onChange={(nextPriority) => {
                setPriority(nextPriority);
                clearError();
              }}
              disabled={isSubmitting}
              className="w-full"
            />

            <AutoResizeTextarea
              value={rawTasks}
              onChange={(event) => {
                setRawTasks(event.target.value);
                clearError();
              }}
              placeholder="Task one, task two; task three"
              minRows={6}
              maxRows={10}
              maxLength={BULK_TASK_IMPORT_MAX_LENGTH}
              lengthWarningRatio={TEXT_LIMIT_WARNING_RATIO}
              disabled={isSubmitting}
              className="app-input w-full"
            />

            <div aria-live="polite" className="min-h-5">
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {taskTitles.length} tasks
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="app-action-button app-action-button-success rounded-md"
              >
                Import
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
