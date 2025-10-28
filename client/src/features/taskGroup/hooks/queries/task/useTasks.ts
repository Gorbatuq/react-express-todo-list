import { useQuery } from "@tanstack/react-query"
import { Task } from "../../../../../types"
import { taskApi } from "../../../../../api/task"

export const useTasks = (groupId: string) => {
  return useQuery<Task[]>({
    queryKey: ["tasks", String(groupId)],
    queryFn: () => taskApi.getTasksByGroup(groupId),
    enabled: !!groupId,
    staleTime: 30 * 1000, 
  })
}

