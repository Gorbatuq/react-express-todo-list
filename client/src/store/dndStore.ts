import type { DropResult } from "@hello-pangea/dnd";
import { useGroupStore } from "./groupStore";
import { useTaskStore } from "./taskStore";

export const handleDragEnd = (result: DropResult) => {
  const { source, destination, draggableId, type } = result;

  if (!destination || !draggableId || (type !== "group" && type !== "task")) return;

  const isSamePosition =
    source.droppableId === destination.droppableId &&
    source.index === destination.index;
  if (isSamePosition) return;

  if (type === "group") {
    const { groupIds, reorderGroups } = useGroupStore.getState();

    const updated = [...groupIds];
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);


    reorderGroups(updated).catch((e) => {
      console.error("Failed to reorder groups", e);
    });

    return;
  }


  const { reorderTasksLocally, moveTaskToAnotherGroup } = useTaskStore.getState();

  if (source.droppableId === destination.droppableId) {
    reorderTasksLocally(source.droppableId, draggableId, destination.index);
  } else {
    moveTaskToAnotherGroup(
      source.droppableId, draggableId, 
      destination.droppableId, destination.index
    );
  }
};
