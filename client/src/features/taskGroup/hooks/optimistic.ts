// src/hooks/optimistic.ts
import type { Task } from "@/types";
import type { QueryClient, QueryKey } from "@tanstack/react-query";

export type Snapshot = { key: QueryKey; data: unknown }[];

export const takeSnapshot = (qc: QueryClient, keys: QueryKey[]): Snapshot =>
  keys.map((key) => ({ key, data: qc.getQueryData(key) }));

export const rollback = (qc: QueryClient, snap: Snapshot) =>
  snap.forEach(({ key, data }) => qc.setQueryData(key, data));

export const applyTaskOrder = (tasks: Task[], order: string[]) =>
  tasks.slice().sort((a, b) => order.indexOf(a._id) - order.indexOf(b._id));
