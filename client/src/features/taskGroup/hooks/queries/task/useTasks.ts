import { useQuery } from "@tanstack/react-query";
import { Task } from "../../../../../types";
import { tasksApi } from "../../../../../api";

export const useTasks = (groupId: string) => {
  return useQuery<Task[]>({
    queryKey: ["tasks", String(groupId)],
    queryFn: () => tasksApi.getByGroupId(groupId),
    enabled: !!groupId,
    staleTime: 30 * 1000,
  });
};
