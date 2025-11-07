import type { DropResult } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { useGroupMutations } from "./queries/group/useGroupMutations";
import { useTaskMutations } from "./queries/task/useTaskMutations";
import { Task, TaskGroup } from "../../../types";

// FIXME: micro flicker (ms) during DnD remains.
// Tried optimistic updates, DnD tweaks, data checks → no fix.
// Only deeper optimistic logic could solve it, skipping for now.


export const useHandleDragEnd = () => {
  const { reorderGroup } = useGroupMutations();
  const { reorderTask, moveTask } = useTaskMutations();
  const queryClient = useQueryClient();

  return async (result: DropResult) => {
    const { destination, source, type, draggableId } = result;

    // If no drop destination → do nothing
    if (!destination) return;

    // If dropped in the same place (same list + same index) → do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // ========= GROUP reorder =========
    if (type === "group") {
      // Get current groups from cache
      const groups = queryClient.getQueryData<TaskGroup[]>(["groups"]) || [];
      const reordered = [...groups];

      // Remove the dragged group from its original index
      const [removed] = reordered.splice(source.index, 1);
      if (!removed) return;

      // Insert it into the new index
      reordered.splice(destination.index, 0, removed);

      // Optimistically update cache
      queryClient.setQueryData(["groups"], reordered);

      // Send update to backend with new group order
      await reorderGroup.mutateAsync(reordered.map((g) => String(g.id)));
      return;
    }

    // ========= TASK reorder or move =========
    if (type === "task") {
      const sourceGroupId = String(source.droppableId);
      const destGroupId = String(destination.droppableId);

      if (sourceGroupId === destGroupId) {
        // --- Reorder inside the same group ---

        // Get tasks for the group from cache
        const tasks =
          queryClient.getQueryData<Task[]>(["tasks", sourceGroupId]) || [];
        const reordered = [...tasks];

        // Remove the dragged task
        const [removed] = reordered.splice(source.index, 1);
        if (!removed) return;

        // Insert task at the new index
        reordered.splice(destination.index, 0, removed);

        // Optimistically update cache for this group
        queryClient.setQueryData(["tasks", sourceGroupId], reordered);

        // Send new task order to backend
        await reorderTask.mutateAsync({
          groupId: sourceGroupId,
          taskIds: reordered.map((t) => String(t.id)),
        });
      } else {
        // --- Move task between groups ---

        // Get source and destination tasks from cache
        const sourceTasks =
          queryClient.getQueryData<Task[]>(["tasks", sourceGroupId]) || [];
        const destTasks =
          queryClient.getQueryData<Task[]>(["tasks", destGroupId]) || [];

        // Find the moved task in source group
        const moved = sourceTasks.find((t) => String(t.id) === draggableId);
        if (!moved) return;

        // Remove it from source group cache
        queryClient.setQueryData(
          ["tasks", sourceGroupId],
          sourceTasks.filter((t) => t.id !== draggableId)
        );

        // Insert into destination group cache at new index
        const newDest = [...destTasks];
        newDest.splice(destination.index, 0, { ...moved, groupId: destGroupId });
        queryClient.setQueryData(["tasks", destGroupId], newDest);

        // Send move info to backend
        await moveTask.mutateAsync({
          groupId: sourceGroupId,       // old group
          taskId: draggableId,          // moved task
          newGroupId: destGroupId,      // target group
          destIndex: destination.index, // target position
        });
      }
    }
  };
};
