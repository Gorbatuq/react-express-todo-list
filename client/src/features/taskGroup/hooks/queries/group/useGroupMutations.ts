import { groupApi } from "@/api/groups";
import type { Priority } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGroupMutations = () => {
  const queryClient = useQueryClient();

  // CREATE
  const createGroup = useMutation({
    mutationFn: (data: { title: string; priority: Priority }) =>
      groupApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group created");
    },
    onError: () => toast.error("Failed to create group"),
  });

  // DELETE
  const deleteGroup = useMutation({
    mutationFn: (groupId: string) => groupApi.delete(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group deleted");
    },
    onError: () => toast.error("Failed to delete group"),
  });

  // UPDATE
  const updateGroup = useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: { title?: string; priority?: Priority } }) =>
      groupApi.update(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group updated");
    },
    onError: () => toast.error("Failed to update group"),
  });

  // REORDER
  const reorderGroup = useMutation({
    mutationFn: (groupIds: string[]) => groupApi.reorder(groupIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: () => toast.error("Failed to reorder groups"),
  });

  return { createGroup, deleteGroup, updateGroup, reorderGroup };
};
