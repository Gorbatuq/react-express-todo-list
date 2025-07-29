import type { DropResult } from "@hello-pangea/dnd";
import { useGroupStore } from "./groupStore";
import { useTaskStore } from "./taskStore";

export const handleDragEnd = (result: DropResult) => {
  const { source, destination, draggableId, type } = result;
  if (!destination) return;

  const isSameLocation =
    source.droppableId === destination.droppableId &&
    source.index === destination.index;
  if (isSameLocation) return;

  if (type === "group") {
    const { groupIds, reorderGroups } = useGroupStore.getState();

    const updated = [...groupIds];
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);

    reorderGroups(updated);
    return;
  }

  const taskStore = useTaskStore.getState();

  if (source.droppableId === destination.droppableId) {

    taskStore.reorderTasksLocally(
      source.droppableId,
      draggableId,
      destination.index
    );
  } else {

    taskStore.moveTaskToAnotherGroup(
      source.droppableId,
      draggableId,
      destination.droppableId,
      destination.index
    );
  }
};
