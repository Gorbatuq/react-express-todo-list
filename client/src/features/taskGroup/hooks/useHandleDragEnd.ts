import { useCallback } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { flushSync } from "react-dom";
import { useGroupMutations } from "./groups/useGroupMutations";
import { useTaskMutations } from "./tasks/useTaskMutations";
import { queryClient } from "../../../lib/queryClient";
import { Task, TaskGroup } from "../../../types";
import { useGroupFilterStore } from "../store/groupFilterStore";
import { filterTasks } from "./useGroupFilter";

const getInsertIndexFromVisibleIndex = (
  tasks: Task[],
  groupId: string,
  visibleIndex: number,
) => {
  const filter = useGroupFilterStore.getState().getFilter(groupId);
  const visibleTasks = filterTasks(tasks, filter);

  if (visibleIndex >= visibleTasks.length) return tasks.length;

  const target = visibleTasks[visibleIndex];
  const targetIndex = tasks.findIndex(
    (task) => String(task.id) === String(target.id),
  );

  return targetIndex === -1 ? tasks.length : targetIndex;
};

const withSequentialTaskOrder = (tasks: Task[]) =>
  tasks.map((task, order) => ({ ...task, order }));

const withSequentialGroupOrder = (groups: TaskGroup[]) =>
  groups.map((group, order) => ({ ...group, order }));

export const useHandleDragEnd = () => {
  const { reorderGroup } = useGroupMutations();
  const { reorderTask, moveTask } = useTaskMutations();
  const reorderGroups = reorderGroup.mutate;
  const reorderTasks = reorderTask.mutate;
  const moveTaskToGroup = moveTask.mutate;

  return useCallback((result: DropResult) => {
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
      const nextWithOrder = withSequentialGroupOrder(next);

      flushSync(() => {
        queryClient.setQueryData(["groups"], nextWithOrder);
      });

      reorderGroups({
        idsInOrder: nextWithOrder.map((group) => String(group.id)),
        prev: groups,
      });
      return;
    }

    if (type === "task") {
      const fromGroupId = String(source.droppableId);
      const toGroupId = String(destination.droppableId);

      if (fromGroupId === toGroupId) {
        const tasks =
          queryClient.getQueryData<Task[]>(["tasks", fromGroupId]) ?? [];
        const movedTask = tasks.find(
          (task) => String(task.id) === String(draggableId),
        );
        if (!movedTask) return;

        const tasksWithoutMoved = tasks.filter(
          (task) => String(task.id) !== String(draggableId),
        );
        const insertIndex = getInsertIndexFromVisibleIndex(
          tasksWithoutMoved,
          fromGroupId,
          destination.index,
        );
        const reorderedTasks = [...tasksWithoutMoved];
        reorderedTasks.splice(insertIndex, 0, movedTask);
        const reorderedTasksWithOrder = withSequentialTaskOrder(reorderedTasks);

        flushSync(() => {
          queryClient.setQueryData(["tasks", fromGroupId], reorderedTasksWithOrder);
        });

        reorderTasks({
          groupId: fromGroupId,
          taskIds: reorderedTasksWithOrder.map((task) => String(task.id)),
          prev: tasks,
        });
        return;
      }

      const sourceTasks =
        queryClient.getQueryData<Task[]>(["tasks", fromGroupId]) ?? [];
      const movedTask = sourceTasks.find(
        (task) => String(task.id) === String(draggableId),
      );
      if (!movedTask) return;

      const destinationTasks =
        queryClient.getQueryData<Task[]>(["tasks", toGroupId]) ?? [];
      const toIndex = getInsertIndexFromVisibleIndex(
        destinationTasks,
        toGroupId,
        destination.index,
      );

      const nextSourceTasks = withSequentialTaskOrder(
        sourceTasks.filter((task) => String(task.id) !== String(draggableId)),
      );
      const nextDestinationTasks = [...destinationTasks];
      nextDestinationTasks.splice(toIndex, 0, {
        ...movedTask,
        groupId: toGroupId,
      });
      const nextDestinationTasksWithOrder =
        withSequentialTaskOrder(nextDestinationTasks);

      flushSync(() => {
        queryClient.setQueryData(["tasks", fromGroupId], nextSourceTasks);
        queryClient.setQueryData(
          ["tasks", toGroupId],
          nextDestinationTasksWithOrder,
        );
      });

      moveTaskToGroup({
        groupId: fromGroupId,
        taskId: draggableId,
        newGroupId: toGroupId,
        toIndex,
        prevSource: sourceTasks,
        prevDest: destinationTasks,
      });
    }
  }, [moveTaskToGroup, reorderGroups, reorderTasks]);
};
