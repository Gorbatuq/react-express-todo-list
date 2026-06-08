import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Task } from "../../../../types";
import { tasksApi } from "../../../../api";

const withSequentialOrder = (tasks: Task[]) =>
  tasks.map((task, order) => ({ ...task, order }));

const orderTasksByIds = (tasks: Task[], taskIds: string[]) => {
  const byId = new Map(tasks.map((task) => [String(task.id), task] as const));

  return withSequentialOrder(
    taskIds
      .map((taskId) => byId.get(String(taskId)))
      .filter(Boolean) as Task[],
  );
};

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
      prevSource?: Task[];
      prevDest?: Task[];
    }) =>
      tasksApi.update(groupId, taskId, {
        groupId: newGroupId,
        toIndex,
      }),

    onMutate: ({
      groupId,
      taskId,
      newGroupId,
      toIndex,
      prevSource: providedPrevSource,
      prevDest: providedPrevDest,
    }) => {
      if (providedPrevSource && providedPrevDest) {
        void queryClient.cancelQueries({ queryKey: ["tasks", groupId] });
        void queryClient.cancelQueries({ queryKey: ["tasks", newGroupId] });
        return { prevSource: providedPrevSource, prevDest: providedPrevDest };
      }

      const prevSource =
        queryClient.getQueryData<Task[]>(["tasks", groupId]) || [];
      const prevDest =
        queryClient.getQueryData<Task[]>(["tasks", newGroupId]) || [];

      const moved = prevSource.find((t) => String(t.id) === String(taskId));
      if (!moved) return { prevSource, prevDest };

      queryClient.setQueryData(
        ["tasks", groupId],
        withSequentialOrder(
          prevSource.filter((t) => String(t.id) !== String(taskId)),
        ),
      );

      const newDest = [...prevDest];
      newDest.splice(toIndex, 0, { ...moved, groupId: newGroupId });
      queryClient.setQueryData(
        ["tasks", newGroupId],
        withSequentialOrder(newDest),
      );
      void queryClient.cancelQueries({ queryKey: ["tasks", groupId] });
      void queryClient.cancelQueries({ queryKey: ["tasks", newGroupId] });

      return { prevSource, prevDest };
    },

    onSuccess: () => {},

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
      taskIds,
      prev,
    }: {
      groupId: string;
      taskIds: string[];
      prev?: Task[];
    }) => {
      return tasksApi.reorder(groupId, taskIds);
    },

    onMutate: ({ groupId, taskIds, prev: providedPrev }) => {
      if (providedPrev) {
        void queryClient.cancelQueries({ queryKey: ["tasks", groupId] });
        return { prev: providedPrev };
      }

      const prev = queryClient.getQueryData<Task[]>(["tasks", groupId]) || [];
      queryClient.setQueryData(
        ["tasks", groupId],
        orderTasksByIds(prev, taskIds),
      );
      void queryClient.cancelQueries({ queryKey: ["tasks", groupId] });

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
