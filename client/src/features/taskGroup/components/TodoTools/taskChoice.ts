import type { TaskWithGroup } from "../../hooks/tasks/useTasksByGroups";

export const WHEEL_COLORS = [
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#a78bfa",
  "#2dd4bf",
  "#fb923c",
  "#f472b6",
];

export const SPIN_DURATION_OPTIONS = [2, 3, 5, 8];

const WHEEL_LIBRARY_SPIN_SECONDS = 11.35;

export const getWheelSpinCoefficient = (seconds: number) =>
  seconds / WHEEL_LIBRARY_SPIN_SECONDS;

export const getRandomTask = (tasks: TaskWithGroup[]) => {
  if (tasks.length === 0) return null;
  return tasks[Math.floor(Math.random() * tasks.length)];
};

export const getTaskLabel = (title: string) => {
  const trimmed = title.trim();
  return trimmed.length > 18 ? `${trimmed.slice(0, 18)}...` : trimmed;
};
