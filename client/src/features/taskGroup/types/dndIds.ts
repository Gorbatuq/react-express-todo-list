import type { UniqueIdentifier } from "@dnd-kit/core";

type Kind = "group" | "task" | "container";

export const dndIds = {
  group: (groupId: string) => `group:${groupId}`,
  task: (taskId: string) => `task:${taskId}`,
  container: (groupId: string) => `container:${groupId}`,
  parse(id: UniqueIdentifier) {
    const s = String(id);
    const i = s.indexOf(":");
    if (i === -1) return null;
    const kind = s.slice(0, i) as Kind;
    const val = s.slice(i + 1);
    if (!val) return null;
    if (kind === "group") return { kind, groupId: val } as const;
    if (kind === "task") return { kind, taskId: val } as const;
    if (kind === "container") return { kind, groupId: val } as const;
    return null;
  },
};
