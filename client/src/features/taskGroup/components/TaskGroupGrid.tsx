import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskGroupCard } from "./TaskGroupCard/TaskGroupCard";
import { useGroupStore } from "@/store/groupStore";

export const TaskGroupGrid = () => {
  const groupIds = useGroupStore((s) => s.groupIds);

  if (groupIds.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center">
        No groups. Create first!!!
      </p>
    );
  }

  return (
    <Droppable droppableId="groups" type="group" direction="horizontal">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start"
        >
          {groupIds
            .filter((id): id is string => typeof id === "string")
            .map((id, index) => {
              return (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskGroupCard groupId={id} />
                    </div>
                  )}
                </Draggable>
              );
            })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
