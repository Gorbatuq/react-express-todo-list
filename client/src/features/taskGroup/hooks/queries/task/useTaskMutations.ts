import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Task } from "../../../../../types";
import { tasksApi } from "../../../../../api";

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  // CREATE
  const addTask = useMutation({
    mutationFn: ({ groupId, title }: { groupId: string; title: string }) =>
      tasksApi.create(groupId, { title }),
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", groupId] });
    },
    onError: () => toast.error("Failed to create task"),
  });

  // MOVE between groups (backend: PATCH /groups/:groupId/tasks/:taskId with { groupId: newGroupId, toIndex })
  const moveTask = useMutation({
    mutationFn: ({
      groupId,
      taskId,
      newGroupId,
      toIndex,
    }: {
      groupId: string;
      taskId: string;
      newGroupId: string;
      toIndex: number;
    }) =>
      tasksApi.update(groupId, taskId, {
        groupId: newGroupId,
        toIndex,
      }),

    onMutate: async ({ groupId, taskId, newGroupId, toIndex }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", groupId] });
      await queryClient.cancelQueries({ queryKey: ["tasks", newGroupId] });

      const prevSource =
        queryClient.getQueryData<Task[]>(["tasks", groupId]) || [];
      const prevDest =
        queryClient.getQueryData<Task[]>(["tasks", newGroupId]) || [];

      const moved = prevSource.find((t) => String(t.id) === String(taskId));
      if (!moved) return { prevSource, prevDest };

      // remove from source
      queryClient.setQueryData(
        ["tasks", groupId],
        prevSource.filter((t) => String(t.id) !== String(taskId))
      );

      // insert into dest
      const newDest = [...prevDest];
      newDest.splice(toIndex, 0, { ...moved, groupId: newGroupId });
      queryClient.setQueryData(["tasks", newGroupId], newDest);

      return { prevSource, prevDest };
    },

    onSuccess: (_d, { groupId, newGroupId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", groupId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", newGroupId] });
    },

    onError: (_e, { groupId, newGroupId }, ctx) => {
      if (ctx) {
        queryClient.setQueryData(["tasks", groupId], ctx.prevSource);
        queryClient.setQueryData(["tasks", newGroupId], ctx.prevDest);
      }
      toast.error("Failed to move task");
    },
  });

  // DELETE
  const deleteTask = useMutation({
    mutationFn: ({ groupId, taskId }: { groupId: string; taskId: string }) =>
      tasksApi.delete(groupId, taskId),
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", groupId] });
    },
    onError: () => toast.error("Failed to delete task"),
  });

  // REORDER inside group
  const reorderTask = useMutation({
    mutationFn: async ({
      groupId,
      fromIndex,
      toIndex,
    }: {
      groupId: string;
      fromIndex: number;
      toIndex: number;
    }) => {
      const tasks = queryClient.getQueryData<Task[]>(["tasks", groupId]) || [];
      const reordered = [...tasks];
      const [moved] = reordered.splice(fromIndex, 1);
      if (!moved) return;
      reordered.splice(toIndex, 0, moved);

      return tasksApi.reorder(
        groupId,
        reordered.map((t) => String(t.id))
      );
    },

    onMutate: async ({ groupId, fromIndex, toIndex }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", groupId] });

      const prev = queryClient.getQueryData<Task[]>(["tasks", groupId]) || [];
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return { prev };

      next.splice(toIndex, 0, moved);
      queryClient.setQueryData(["tasks", groupId], next);

      return { prev };
    },

    onError: (_err, { groupId }, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["tasks", groupId], ctx.prev);
      toast.error("Failed to reorder tasks");
    },

    // IMPORTANT: remove invalidate onSuccess (it causes flicker)
    onSuccess: () => {},
  });

  // UPDATE title/completed (and can also be used for same-group move if you pass toIndex)
  const updateTask = useMutation({
    mutationFn: ({
      groupId,
      taskId,
      payload,
    }: {
      groupId: string;
      taskId: string;
      payload: Partial<Pick<Task, "title" | "completed">> & {
        groupId?: string;
        toIndex?: number;
      };
    }) => tasksApi.update(groupId, taskId, payload),

    onMutate: async ({ groupId, taskId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", groupId] });
      const prev = queryClient.getQueryData<Task[]>(["tasks", groupId]) || [];

      queryClient.setQueryData(
        ["tasks", groupId],
        prev.map((t) =>
          String(t.id) === String(taskId) ? { ...t, ...payload } : t
        )
      );

      return { prev };
    },

    onError: (_e, { groupId }, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["tasks", groupId], ctx.prev);
      toast.error("Failed to update task");
    },

    onSuccess: (_d, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", groupId] });
    },
  });

  return { addTask, moveTask, deleteTask, reorderTask, updateTask };
};
