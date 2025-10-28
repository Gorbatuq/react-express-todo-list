import { useState, useMemo } from "react";
import { Task } from "../../../types";

export type FilterType = "all" | "active" | "completed";

export const useGroupFilter = (tasks: Task[]) => {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    });
  }, [tasks, filter]);

  return { filter, setFilter, filteredTasks };
};
