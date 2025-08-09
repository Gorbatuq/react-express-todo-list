// src/hooks/tasks/mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/api/task";
import type { Task } from "@/types";
import { qk } from "../queryKeys";
import { takeSnapshot, rollback, applyTaskOrder } from "../optimistic";

export const useAddTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, title }: { groupId: string; title: string }) =>
      taskApi.add(groupId, title),
    onMutate: async ({ groupId, title }) => {
      const key = qk.tasks(groupId);
      await qc.cancelQueries({ queryKey: key });
      const snap = takeSnapshot(qc, [key]);
      qc.setQueryData<Task[]>(key, (old = []) => [...old, { _id: "temp-"+Date.now(), title, completed:false, groupId } as any]);
      return { snap, key };
    },
    onError: (_e, _v, ctx) => ctx && rollback(qc, ctx.snap),
    onSettled: (_d,_e, vars) => qc.invalidateQueries({ queryKey: qk.tasks(vars.groupId) }),
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, taskId, data }:
      { groupId: string; taskId: string; data: Partial<Pick<Task,"title"|"completed"|"groupId">> }) =>
      taskApi.update(groupId, taskId, data),
    onMutate: async ({ groupId, taskId, data }) => {
      const key = qk.tasks(groupId);
      await qc.cancelQueries({ queryKey: key });
      const snap = takeSnapshot(qc, [key]);
      qc.setQueryData<Task[]>(key, (old = []) => old.map(t => t._id === taskId ? { ...t, ...data } : t));
      return { snap, key };
    },
    onError: (_e, _v, ctx) => ctx && rollback(qc, ctx.snap),
    onSettled: (_d,_e, vars) => qc.invalidateQueries({ queryKey: qk.tasks(vars.groupId) }),
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, taskId }: { groupId: string; taskId: string }) =>
      taskApi.delete(groupId, taskId),
    onMutate: async ({ groupId, taskId }) => {
      const key = qk.tasks(groupId);
      await qc.cancelQueries({ queryKey: key });
      const snap = takeSnapshot(qc, [key]);
      qc.setQueryData<Task[]>(key, (old = []) => old.filter(t => t._id !== taskId));
      return { snap, key };
    },
    onError: (_e, _v, ctx) => ctx && rollback(qc, ctx.snap),
    onSettled: (_d,_e, vars) => qc.invalidateQueries({ queryKey: qk.tasks(vars.groupId) }),
  });
};

// reorder в межах групи
export const useReorderTasks = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, order }: { groupId: string; order: string[] }) =>
      taskApi.reorder(groupId, order),
    onMutate: async ({ groupId, order }) => {
      const key = qk.tasks(groupId);
      await qc.cancelQueries({ queryKey: key });
      const snap = takeSnapshot(qc, [key]);
      qc.setQueryData<Task[]>(key, (old = []) => applyTaskOrder(old, order));
      return { snap, key };
    },
    onError: (_e,_v,ctx) => ctx && rollback(qc, ctx.snap),
    onSettled: (_d,_e,vars) => qc.invalidateQueries({ queryKey: qk.tasks(vars.groupId) }),
  });
};

// move між групами (+ reorder цільової)
export const useMoveTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fromId, taskId, toId, toOrder }:
      { fromId: string; taskId: string; toId: string; toOrder: string[] }) =>
      taskApi.move(fromId, taskId, toId).then(() => taskApi.reorder(toId, toOrder)),
    onMutate: async ({ fromId, taskId, toId, toOrder }) => {
      const kFrom = qk.tasks(fromId);
      const kTo = qk.tasks(toId);
      await Promise.all([
        qc.cancelQueries({ queryKey: kFrom }),
        qc.cancelQueries({ queryKey: kTo }),
      ]);
      const snap = takeSnapshot(qc, [kFrom, kTo]);

      const from = (qc.getQueryData<Task[]>(kFrom) ?? []).filter(t => t._id !== taskId);
      const moved = [...(qc.getQueryData<Task[]>(kTo) ?? []),
        ...(qc.getQueryData<Task[]>(kFrom) ?? []).filter(t => t._id === taskId).map(t => ({ ...t, groupId: toId }))
      ];

      qc.setQueryData<Task[]>(kFrom, from);
      qc.setQueryData<Task[]>(kTo, applyTaskOrder(moved, toOrder));
      return { snap };
    },
    onError: (_e,_v,ctx) => ctx && rollback(qc, ctx.snap),
    onSettled: (_d,_e,vars) => {
      qc.invalidateQueries({ queryKey: qk.tasks(vars.fromId) });
      qc.invalidateQueries({ queryKey: qk.tasks(vars.toId) });
    },
  });
};
