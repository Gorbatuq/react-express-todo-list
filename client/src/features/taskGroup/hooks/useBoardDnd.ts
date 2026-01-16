import {
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { queryClient } from "../../../lib/queryClient";
import type { Task, TaskGroup } from "../../../types";
import { useGroupMutations } from "./queries/group/useGroupMutations";
import { useTaskMutations } from "./queries/task/useTaskMutations";
import { dndIds } from "../types/dndIds";

const getGroups = () => queryClient.getQueryData<TaskGroup[]>(["groups"]) ?? [];
const getTasks = (g: string) =>
  queryClient.getQueryData<Task[]>(["tasks", g]) ?? [];

const idxGroup = (arr: TaskGroup[], id: string) =>
  arr.findIndex((g) => String(g.id) === String(id));
const idxTask = (arr: Task[], id: string) =>
  arr.findIndex((t) => String(t.id) === String(id));

export const useBoardDnd = () => {
  const { reorderGroup } = useGroupMutations();
  const { reorderTask, moveTask } = useTaskMutations();

  // desktop: distance; touch: long-press
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 220, tolerance: 6 },
    })
  );

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const a = dndIds.parse(active.id);
    const o = dndIds.parse(over.id);
    if (!a || !o) return;

    // groups reorder
    if (a.kind === "group" && o.kind === "group") {
      if (a.groupId === o.groupId) return;
      const groups = getGroups();
      const from = idxGroup(groups, a.groupId);
      const to = idxGroup(groups, o.groupId);
      if (from < 0 || to < 0 || from === to) return;
      const next = arrayMove(groups, from, to);
      queryClient.setQueryData(["groups"], next);
      await reorderGroup.mutateAsync(next.map((g) => String(g.id)));
      return;
    }

    // tasks reorder/move
    if (a.kind === "task") {
      const fromGroupId = String((active.data.current as any)?.groupId ?? "");
      if (!fromGroupId) return;

      const fromTasks = getTasks(fromGroupId);
      const fromIndex = idxTask(fromTasks, a.taskId);
      if (fromIndex < 0) return;

      let toGroupId: string | null = null;
      let toIndex: number | null = null;

      if (o.kind === "task") {
        toGroupId = String((over.data.current as any)?.groupId ?? "");
        if (!toGroupId) return;
        const toTasks = getTasks(toGroupId);
        const overIdx = idxTask(toTasks, o.taskId);
        if (overIdx < 0) return;
        toIndex = overIdx;
      } else if (o.kind === "container") {
        toGroupId = o.groupId;
        toIndex = getTasks(toGroupId).length;
      } else {
        return;
      }

      if (!toGroupId || toIndex == null) return;

      if (toGroupId === fromGroupId) {
        if (toIndex === fromIndex) return;
        await reorderTask.mutateAsync({
          groupId: fromGroupId,
          fromIndex,
          toIndex,
        });
        return;
      }

      await moveTask.mutateAsync({
        groupId: fromGroupId,
        taskId: a.taskId,
        newGroupId: toGroupId,
        toIndex,
      });
    }
  };

  return { sensors, onDragEnd };
};

// import {
//   DragEndEvent,
//   DragOverEvent,
//   DragStartEvent,
//   PointerSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import { arrayMove } from "@dnd-kit/sortable";
// import { queryClient } from "../../../lib/queryClient";
// import type { Task, TaskGroup } from "../../../types";
// import { useGroupMutations } from "./queries/group/useGroupMutations";
// import { useTaskMutations } from "./queries/task/useTaskMutations";
// import { dndIds } from "../types/dndIds";

// const lastPreview = { taskId: "", toGroupId: "", toIndex: -1 };

// const getGroups = () => queryClient.getQueryData<TaskGroup[]>(["groups"]) ?? [];
// const getTasks = (g: string) =>
//   queryClient.getQueryData<Task[]>(["tasks", g]) ?? [];

// const idxGroup = (arr: TaskGroup[], id: string) =>
//   arr.findIndex((g) => String(g.id) === String(id));
// const idxTask = (arr: Task[], id: string) =>
//   arr.findIndex((t) => String(t.id) === String(id));

// export const useBoardDnd = () => {
//   const { reorderGroup } = useGroupMutations();
//   const { reorderTask, moveTask } = useTaskMutations();

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
//     useSensor(TouchSensor, {
//       activationConstraint: { delay: 220, tolerance: 6 },
//     })
//   );

//   const onDragStart = (_e: DragStartEvent) => {
//     lastPreview.taskId = "";
//     lastPreview.toGroupId = "";
//     lastPreview.toIndex = -1;
//   };

//   const onDragOver = (e: DragOverEvent) => {
//     const { active, over } = e;
//     if (!over) return;
//     const a = dndIds.parse(active.id);
//     const o = dndIds.parse(over.id);
//     if (!a || !o || a.kind !== "task") return;

//     const fromGroupId = String((active.data.current as any)?.groupId ?? "");
//     if (!fromGroupId) return;

//     let toGroupId: string | null = null;
//     let toIndex: number | null = null;

//     if (o.kind === "task") {
//       toGroupId = String((over.data.current as any)?.groupId ?? "");
//       if (!toGroupId) return;
//       const toTasks = getTasks(toGroupId);
//       const overIdx = idxTask(toTasks, o.taskId);
//       if (overIdx < 0) return;
//       toIndex = overIdx;
//     } else if (o.kind === "container") {
//       toGroupId = o.groupId;
//       toIndex = getTasks(toGroupId).length;
//     } else return;

//     if (
//       lastPreview.taskId === a.taskId &&
//       lastPreview.toGroupId === toGroupId &&
//       lastPreview.toIndex === (toIndex ?? -1)
//     )
//       return;

//     lastPreview.taskId = a.taskId;
//     lastPreview.toGroupId = toGroupId!;
//     lastPreview.toIndex = toIndex ?? -1;

//     if (toGroupId === fromGroupId) {
//       const tasks = getTasks(fromGroupId);
//       const fromIndex = idxTask(tasks, a.taskId);
//       if (fromIndex < 0 || toIndex == null || toIndex === fromIndex) return;
//       const next = [...tasks];
//       const [moved] = next.splice(fromIndex, 1);
//       next.splice(toIndex, 0, moved);
//       queryClient.setQueryData(["tasks", fromGroupId], next);
//     } else {
//       const src = getTasks(fromGroupId);
//       const dst = getTasks(toGroupId!);
//       const fromIndex = idxTask(src, a.taskId);
//       if (fromIndex < 0 || toIndex == null) return;

//       const srcNext = [...src];
//       const [moved] = srcNext.splice(fromIndex, 1);
//       const dstNext = [...dst];
//       dstNext.splice(toIndex, 0, { ...moved, groupId: toGroupId! });

//       queryClient.setQueryData(["tasks", fromGroupId], srcNext);
//       queryClient.setQueryData(["tasks", toGroupId!], dstNext);
//     }
//   };

//   const onDragEnd = async ({ active, over }: DragEndEvent) => {
//     if (!over) return;
//     const a = dndIds.parse(active.id);
//     const o = dndIds.parse(over.id);
//     if (!a || !o) return;

//     if (a.kind === "group" && o.kind === "group") {
//       if (a.groupId === o.groupId) return;
//       const groups = getGroups();
//       const from = idxGroup(groups, a.groupId);
//       const to = idxGroup(groups, o.groupId);
//       if (from < 0 || to < 0 || from === to) return;
//       const next = arrayMove(groups, from, to);
//       queryClient.setQueryData(["groups"], next);
//       await reorderGroup.mutateAsync(next.map((g) => String(g.id)));
//       return;
//     }

//     if (a.kind === "task") {
//       const fromGroupId = String((active.data.current as any)?.groupId ?? "");
//       if (!fromGroupId) return;

//       let toGroupId: string | null = null;
//       let toIndex: number | null = null;

//       if (o.kind === "task") {
//         toGroupId = String((over.data.current as any)?.groupId ?? "");
//         if (!toGroupId) return;
//         const toTasks = getTasks(toGroupId);
//         const overIdx = idxTask(toTasks, o.taskId);
//         if (overIdx < 0) return;
//         toIndex = overIdx;
//       } else if (o.kind === "container") {
//         toGroupId = o.groupId;
//         toIndex = getTasks(toGroupId).length;
//       } else return;

//       if (!toGroupId || toIndex == null) return;

//       if (toGroupId === fromGroupId) {
//         const fromTasks = getTasks(fromGroupId);
//         const fromIndex = idxTask(fromTasks, a.taskId);
//         if (fromIndex < 0 || toIndex === fromIndex) return;
//         await reorderTask.mutateAsync({
//           groupId: fromGroupId,
//           fromIndex,
//           toIndex,
//         });
//         return;
//       }

//       await moveTask.mutateAsync({
//         groupId: fromGroupId,
//         taskId: a.taskId,
//         newGroupId: toGroupId,
//         toIndex,
//       });
//     }
//   };

//   const onDragCancel = () => {
//     if (lastPreview.toGroupId) {
//       queryClient.invalidateQueries({
//         queryKey: ["tasks", lastPreview.toGroupId],
//       });
//     }
//     lastPreview.taskId = "";
//     lastPreview.toGroupId = "";
//     lastPreview.toIndex = -1;
//   };

//   return { sensors, onDragStart, onDragOver, onDragEnd, onDragCancel };
// };
