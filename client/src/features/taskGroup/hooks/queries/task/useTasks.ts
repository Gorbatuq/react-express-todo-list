import { taskApi } from "@/api/task"
import type { Task } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const useTasks = (groupId: string) => {
  return useQuery<Task[]>({
    queryKey: ["tasks", String(groupId)],
    queryFn: () => taskApi.getTasksByGroup(groupId),
    enabled: !!groupId,
    staleTime: 30 * 1000, 
  })
}

