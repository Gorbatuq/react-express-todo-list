import type { DropResult } from "@hello-pangea/dnd";
import { useGroupMutations } from "./queries/group/useGroupMutations";
import { useTaskMutations } from "./queries/task/useTaskMutations";
import { queryClient } from "../../../lib/queryClient";
import { TaskGroup } from "../../../types";

export const useHandleDragEnd = () => {
  const { reorderGroup } = useGroupMutations();
  const { reorderTask, moveTask } = useTaskMutations();

  return async (result: DropResult) => {
    const { destination, source, type, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "group") {
      const groups = queryClient.getQueryData<TaskGroup[]>(["groups"]) ?? [];
      const next = [...groups];
      const [moved] = next.splice(source.index, 1);
      if (!moved) return;
      next.splice(destination.index, 0, moved);

      await reorderGroup.mutateAsync(next.map((g) => String(g.id)));
      return;
    }

    if (type === "task") {
      const fromGroupId = String(source.droppableId);
      const toGroupId = String(destination.droppableId);

      if (fromGroupId === toGroupId) {
        await reorderTask.mutateAsync({
          groupId: fromGroupId,
          fromIndex: source.index,
          toIndex: destination.index,
        });
        return;
      }

      await moveTask.mutateAsync({
        groupId: fromGroupId,
        taskId: draggableId,
        newGroupId: toGroupId,
        toIndex: destination.index,
      });
    }
  };
};
