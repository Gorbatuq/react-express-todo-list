/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  FilterType,
  EditingGroup,
  EditingTask,
  Handlers,
} from "../TaskGroupCard/TaskGroupCard.types";
import type { TaskGroup } from "../../model/types";

export interface TaskGroupContextType {
  groups: TaskGroup[];
  setGroups: Dispatch<SetStateAction<TaskGroup[]>>;
  taskTitles: Record<string, string>;
  setTaskTitles: Dispatch<SetStateAction<Record<string, string>>>;
  filter: Record<string, FilterType>;
  setFilter: Dispatch<SetStateAction<Record<string, FilterType>>>;
  editingGroup: EditingGroup | null;
  setEditingGroup: Dispatch<SetStateAction<EditingGroup | null>>;
  editingTask: EditingTask | null;
  setEditingTask: Dispatch<SetStateAction<EditingTask | null>>;
  handlers: Handlers;
}

export const TaskGroupContext = createContext<TaskGroupContextType | undefined>(
  undefined
);

export const TaskGroupProvider = TaskGroupContext.Provider;
