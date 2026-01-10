export type Priority = 1 | 2 | 3 | 4;

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
