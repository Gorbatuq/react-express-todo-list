// src/hooks/groups/mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupApi } from "@/api/groups";
import type { TaskGroup } from "@/types";
import { qk } from "../queryKeys";
import { takeSnapshot, rollback } from "../optimistic";

export const useCreateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; priority: 1|2|3|4 }) => groupApi.create(data),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: qk.groups });
      const snap = takeSnapshot(qc, [qk.groups]);
      qc.setQueryData<TaskGroup[]>(qk.groups, (old = []) => [
        ...old,
        { id: "temp-"+Date.now(), title: vars.title, priority: vars.priority } as any,
      ]);
      return { snap };
    },
    onError: (_e, _v, ctx) => ctx && rollback(qc, ctx.snap),
    onSettled: () => qc.invalidateQueries({ queryKey: qk.groups }),
  });
};

export const useUpdateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pick<TaskGroup,"title"|"priority">> }) =>
      groupApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: qk.groups });
      const snap = takeSnapshot(qc, [qk.groups]);
      qc.setQueryData<TaskGroup[]>(qk.groups, (old = []) =>
        old.map(g => g.id === id ? { ...g, ...data } : g)
      );
      return { snap };
    },
    onError: (_e, _v, ctx) => ctx && rollback(qc, ctx.snap),
    onSettled: () => qc.invalidateQueries({ queryKey: qk.groups }),
  });
};

export const useDeleteGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => groupApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.groups });
      const snap = takeSnapshot(qc, [qk.groups]);
      qc.setQueryData<TaskGroup[]>(qk.groups, (old = []) => old.filter(g => g.id !== id));
      return { snap };
    },
    onError: (_e, _v, ctx) => ctx && rollback(qc, ctx.snap),
    onSettled: () => qc.invalidateQueries({ queryKey: qk.groups }),
  });
};

export const useReorderGroups = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (order: string[]) => groupApi.reorder(order),
    onMutate: async (order) => {
      await qc.cancelQueries({ queryKey: qk.groups });
      const snap = takeSnapshot(qc, [qk.groups]);
      qc.setQueryData<TaskGroup[]>(qk.groups, (old = []) =>
        order.map(id => old.find(g => g.id === id)!).filter(Boolean)
      );
      return { snap };
    },
    onError: (_e, _v, ctx) => ctx && rollback(qc, ctx.snap),
    onSettled: () => qc.invalidateQueries({ queryKey: qk.groups }),
  });
};
