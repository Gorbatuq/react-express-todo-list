import { useMemo } from "react";
import { FILTER_OPTIONS, FilterType, Task } from "../../../types";
import { useGroupFilterStore } from "../store/groupFilterStore";

export const filterTasks = (tasks: Task[], filter: FilterType) => {
  return tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
};

export const useGroupFilter = (groupId: string, tasks: Task[]) => {
  const filter = useGroupFilterStore((state) => state.getFilter(groupId));
  const setGroupFilter = useGroupFilterStore((state) => state.setFilter);

  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, filter);
  }, [tasks, filter]);

  return {
    filter,
    setFilter: (nextFilter: FilterType) => setGroupFilter(groupId, nextFilter),
    filteredTasks,
    filterOptions: FILTER_OPTIONS,
  };
};
