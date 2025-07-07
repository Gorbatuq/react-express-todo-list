import type { Task, TaskGroup } from "../../model/types";

export type FilterType = "all" | "completed" | "active";

export interface EditingGroup {
  id: string;
  title: string;
}

export interface EditingTask {
  groupId: string;
  taskId: string;
  title: string;
}

export interface Handlers {
  deleteGroup: (groupId: string) => Promise<{ message: string }>;
  addTaskToGroup: (groupId: string, title: string) => Promise<Task>;
  updateGroupTitle: (groupId: string, title: string) => Promise<TaskGroup>;
  handleToggleTask: (groupId: string, taskId: string) => void;
  updateTaskTitle: (groupId: string, taskId: string, title: string) => Promise<Task>;
  deleteTaskFromGroup: (groupId: string, taskId: string) => Promise<{ message: string }>;
  reload?: () => void;
}

export interface Props {
  group: TaskGroup;
  index: number;
  taskTitles: Record<string, string>;
  setTaskTitles: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  filter: Record<string, FilterType>;
  setFilter: React.Dispatch<React.SetStateAction<Record<string, FilterType>>>;
  editingGroup: EditingGroup | null;
  setEditingGroup: React.Dispatch<React.SetStateAction<EditingGroup | null>>;
  editingTask: EditingTask | null;
  setEditingTask: React.Dispatch<React.SetStateAction<EditingTask | null>>;
  handlers: Handlers;
}
