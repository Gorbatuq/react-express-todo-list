// src/hooks/queryKeys.ts
import type { QueryKey } from "@tanstack/react-query";

export const qk = {
  me: ["me"] as const,
  groups: ["groups"] as const,
  tasks: (gid: string): QueryKey => ["tasks", gid] as const,
};
