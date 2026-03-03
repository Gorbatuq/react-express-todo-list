import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskGroupCard } from "./TaskGroupCard/TaskGroupCard";
import { TaskGroup } from "../../../types";

type Props = {
  groups: TaskGroup[];
};

export const TaskGroupGrid = ({ groups }: Props) => {
  if (groups.length === 0) {
    return (
      <p className="text-gray-500 text-lg text-center">
        No groups. Create first group !
      </p>
    );
  }

  return (
    <Droppable droppableId="groups" type="group" direction="horizontal">
      {(droppableProvided) => (
        <div
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
           gap-6 items-start max-w-full"
        >
          {groups.map((group, index) => {
            return (
              <Draggable key={group.id} draggableId={group.id} index={index}>
                {(droppableProvided) => (
                  <div
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.draggableProps}
                    style={droppableProvided.draggableProps.style}
                  >
                    <TaskGroupCard
                      group={group}
                      dragHandleProps={droppableProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            );
          })}
          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
