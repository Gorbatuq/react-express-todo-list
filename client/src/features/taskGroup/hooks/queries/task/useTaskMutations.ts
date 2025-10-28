import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { taskApi } from "../../../../../api/task";
import { Task } from "../../../../../types";

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  // CREATE -> add new task into group
  const addTask = useMutation({
    mutationFn: ({ groupId, title }: { groupId: string; title: string }) =>
      taskApi.add(groupId, title),
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", groupId] });
    },
    onError: () => toast.error("Failed to create task"),
  });

  // MOVE -> between different groups (with rollback)
  const moveTask = useMutation({
    mutationFn: ({ groupId, taskId, newGroupId }: {
      groupId: string; taskId: string; newGroupId: string; destIndex: number;
    }) => taskApi.move(groupId, taskId, newGroupId),

    onMutate: async ({ groupId, taskId, newGroupId, destIndex }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", groupId] });
      await queryClient.cancelQueries({ queryKey: ["tasks", newGroupId] });

      const prevSource = queryClient.getQueryData<Task[]>(["tasks", groupId]) || [];
      const prevDest = queryClient.getQueryData<Task[]>(["tasks", newGroupId]) || [];

      const moved = prevSource.find((t) => String(t.id) === String(taskId));
      if (!moved) return { prevSource, prevDest };

      queryClient.setQueryData(["tasks", groupId], prevSource.filter((t) => t.id !== taskId));

      const newDest = [...prevDest];
      newDest.splice(destIndex, 0, { ...moved, groupId: newGroupId });
      queryClient.setQueryData(["tasks", newGroupId], newDest);

      return { prevSource, prevDest };
    },

    onError: (_e, { groupId, newGroupId }, ctx) => {
      if (ctx) {
        queryClient.setQueryData(["tasks", groupId], ctx.prevSource);
        queryClient.setQueryData(["tasks", newGroupId], ctx.prevDest);
      }
      toast.error("Failed to move task");
    },
  });

  // DELETE -> remove task
  const deleteTask = useMutation({
    mutationFn: ({ groupId, taskId }: { groupId: string; taskId: string }) =>
      taskApi.delete(groupId, taskId),
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", groupId] });
    },
    onError: () => toast.error("Failed to delete task"),
  });

  // REORDER -> change order inside the same group
  const reorderTask = useMutation({
    mutationFn: ({ groupId, taskIds }: { groupId: string; taskIds: string[] }) =>
      taskApi.reorder(groupId, taskIds),

    onMutate: async ({ groupId, taskIds }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", groupId] });
      const prev = queryClient.getQueryData<Task[]>(["tasks", groupId]) || [];

      const reordered = taskIds
        .map((id) => prev.find((t) => String(t.id) === String(id)))
        .filter(Boolean) as Task[];

      queryClient.setQueryData(["tasks", groupId], reordered);
      return { prev };
    },

    onError: (_err, { groupId }, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["tasks", groupId], ctx.prev);
      toast.error("Failed to reorder tasks");
    },
  });

  // UPDATE -> change task fields (title, completed)
  const updateTask = useMutation({
    mutationFn: ({ groupId, taskId, payload }: {
      groupId: string;
      taskId: string;
      payload: Partial<Pick<Task, "title" | "completed">>;
    }) => taskApi.update(groupId, taskId, payload),

    onMutate: async ({ groupId, taskId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", groupId] });
      const prev = queryClient.getQueryData<Task[]>(["tasks", groupId]) || [];

      queryClient.setQueryData(
        ["tasks", groupId],
        prev.map((t) => (t.id === taskId ? { ...t, ...payload } : t))
      );

      return { prev };
    },

    onError: (_e, { groupId }, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["tasks", groupId], ctx.prev);
      toast.error("Failed to update task");
    },
  });

  return { addTask, moveTask, deleteTask, reorderTask, updateTask };
};
