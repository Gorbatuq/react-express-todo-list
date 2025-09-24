import { useGroupMutations } from "@/features/taskGroup/hooks/queries/group/useGroupMutations";
import { useTaskMutations } from "@/features/taskGroup/hooks/queries/task/useTaskMutations";
import type { Task, TaskGroup } from "@/types";
import type { DropResult } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";

export const useHandleDragEnd = () => {
  const { reorderGroup } = useGroupMutations();
  const { reorderTask, moveTask } = useTaskMutations();
  const queryClient = useQueryClient();

  return async (result: DropResult) => {
    const { destination, source, type, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // ========= GROUP reorder =========
    if (type === "group") {
      const groups = queryClient.getQueryData<TaskGroup[]>(["groups"]) || [];
      const reordered = [...groups];
      const [removed] = reordered.splice(source.index, 1);
      if (!removed) return;

      reordered.splice(destination.index, 0, removed);

      queryClient.setQueryData(["groups"], reordered);

      await reorderGroup.mutateAsync(reordered.map((g) => String(g.id)));
      return;
    }

    // ========= TASK reorder or move =========
    if (type === "task") {
      const sourceGroupId = String(source.droppableId);
      const destGroupId = String(destination.droppableId);

      if (sourceGroupId === destGroupId) {
        // reorder inside same group
        const tasks =
          queryClient.getQueryData<Task[]>(["tasks", sourceGroupId]) || [];
        const reordered = [...tasks];
        const [removed] = reordered.splice(source.index, 1);
        if (!removed) return;

        reordered.splice(destination.index, 0, removed);

        queryClient.setQueryData(["tasks", sourceGroupId], reordered);

        await reorderTask.mutateAsync({
          groupId: sourceGroupId,
          taskIds: reordered.map((t) => String(t.id)),
        });
      } else {
        // move between groups
        const sourceTasks =
          queryClient.getQueryData<Task[]>(["tasks", sourceGroupId]) || [];
        const destTasks =
          queryClient.getQueryData<Task[]>(["tasks", destGroupId]) || [];

        const moved = sourceTasks.find((t) => String(t.id) === draggableId);
        if (!moved) return;

        queryClient.setQueryData(
          ["tasks", sourceGroupId],
          sourceTasks.filter((t) => t.id !== draggableId)
        );

        const newDest = [...destTasks];
        newDest.splice(destination.index, 0, { ...moved, groupId: destGroupId });
        queryClient.setQueryData(["tasks", destGroupId], newDest);

        await moveTask.mutateAsync({
          groupId: sourceGroupId,
          taskId: draggableId,
          newGroupId: destGroupId,
          destIndex: destination.index,
        });
      }
    }
  };
};
