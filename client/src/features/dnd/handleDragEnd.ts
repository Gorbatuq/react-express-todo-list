// features/dnd/handleDragEnd.ts
import type { DropResult } from "@hello-pangea/dnd";
export const makeHandleDragEnd = ({
  reorderTasks,
  moveTask,
}: {
  reorderTasks: (p: { groupId: string; order: string[] }) => void;
  moveTask: (p: { fromId: string; taskId: string; toId: string; toOrder: string[] }) => void;
}) => (result: DropResult, currentOrders: (gid: string) => string[]) => {
  const { source, destination, draggableId, type } = result;
  if (!destination || type !== "task") return;

  const fromId = source.droppableId;
  const toId = destination.droppableId;

  if (fromId === toId) {
    const order = currentOrders(fromId)
      .filter(id => id !== draggableId);
    order.splice(destination.index, 0, draggableId);
    reorderTasks({ groupId: fromId, order });
  } else {
    const toOrder = currentOrders(toId);
    const order = toOrder.filter(id => id !== draggableId);
    order.splice(destination.index, 0, draggableId);
    moveTask({ fromId, taskId: draggableId, toId, toOrder: order });
  }
};
