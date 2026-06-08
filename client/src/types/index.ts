export const PRIORITY_OPTIONS = [
  { value: 1, label: "High", colorClassName: "bg-red-500" },
  { value: 2, label: "Medium", colorClassName: "bg-orange-400" },
  { value: 3, label: "Low", colorClassName: "bg-yellow-200" },
  { value: 4, label: "Super Low", colorClassName: "bg-blue-100" },
] as const;

export type Priority = (typeof PRIORITY_OPTIONS)[number]["value"];

export const DEFAULT_PRIORITY: Priority = 2;

export const PRIORITY_COLORS: Record<Priority, string> =
  PRIORITY_OPTIONS.reduce(
    (colors, option) => ({
      ...colors,
      [option.value]: option.colorClassName,
    }),
    {} as Record<Priority, string>,
  );

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

export const FILTER_OPTIONS = ["all", "completed", "active"] as const;
export type FilterType = (typeof FILTER_OPTIONS)[number];

export type User = {
  id: string;
  email: string;
  role: "USER" | "GUEST";
  createdAt: string;
  taskCount?: number;
};

export type TaskGroup = {
  id: string;
  title: string;
  order: number;
  priority: Priority;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  groupId: string;
};
