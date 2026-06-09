import { useQueries } from "@tanstack/react-query";
import { tasksApi } from "../../../../api";
import type { Task, TaskGroup } from "../../../../types";

export type TaskWithGroup = Task & {
  groupTitle: string;
};

export const useTasksByGroups = (groups: TaskGroup[], enabled: boolean) => {
  const queries = useQueries({
    queries: groups.map((group) => ({
      queryKey: ["tasks", String(group.id)],
      queryFn: () => tasksApi.getByGroupId(group.id),
      enabled,
      staleTime: 30 * 1000,
    })),
  });

  const tasks = queries.flatMap((query, index) => {
    const group = groups[index];
    const groupTasks = (query.data ?? []) as Task[];

    return groupTasks.map((task) => ({
      ...task,
      groupTitle: group.title,
    }));
  });

  return {
    tasks,
    isLoading: queries.some((query) => query.isLoading),
    isFetching: queries.some((query) => query.isFetching),
  };
};
