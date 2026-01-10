import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Priority, TaskGroup } from "../../../../../types";
import { groupsApi } from "../../../../../api";

export const useGroupMutations = () => {
  const queryClient = useQueryClient();

  // CREATE
  const createGroup = useMutation({
    mutationFn: (data: { title: string; priority: Priority }) =>
      groupsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast("Group created");
    },
    onError: () => toast.error("Failed to create group"),
  });

  // DELETE
  const deleteGroup = useMutation({
    mutationFn: (groupId: string) => groupsApi.delete(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast("Group deleted");
    },
    onError: () => toast.error("Failed to delete group"),
  });

  // UPDATE
  const updateGroup = useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: { title?: string; priority?: Priority };
    }) => groupsApi.update(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: () => toast.error("Failed to update group"),
  });

  // REORDER
  const reorderGroup = useMutation({
    mutationFn: (idsInOrder: string[]) => groupsApi.reorder(idsInOrder),

    onMutate: async (idsInOrder) => {
      await queryClient.cancelQueries({ queryKey: ["groups"] });

      const prev = queryClient.getQueryData<TaskGroup[]>(["groups"]) ?? [];
      const byId = new Map(prev.map((g) => [String(g.id), g] as const));

      const next = idsInOrder
        .map((id) => byId.get(String(id)))
        .filter(Boolean) as TaskGroup[];

      const nextWithOrder = next.map((g, i) => ({ ...g, order: i }));

      queryClient.setQueryData(["groups"], nextWithOrder);
      return { prev };
    },

    onError: (_e, _ids, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["groups"], ctx.prev);
      toast.error("Failed to reorder groups");
    },

    onSuccess: (serverGroups) => {
      const normalized = serverGroups.map((g, i) => ({ ...g, order: i }));
      queryClient.setQueryData(["groups"], normalized);
    },
  });

  return { createGroup, deleteGroup, updateGroup, reorderGroup };
};
