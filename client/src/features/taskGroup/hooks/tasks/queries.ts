// src/hooks/tasks/queries.ts
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "@/api/task";
import { qk } from "../queryKeys";
export const useTasks = (groupId: string | null) =>
  useQuery({
    queryKey: groupId ? qk.tasks(groupId) : ["__disabled__"],
    queryFn: () => taskApi.getTasksByGroup(groupId!),
    enabled: !!groupId,
  });
