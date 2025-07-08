import { Droppable } from "@hello-pangea/dnd";
import { TaskGroupCard } from "./TaskGroupCard/TaskGroupCard";
import { useGroupsContext } from "./contexts/GroupsContext";

export const TaskGroupGrid = () => {
  const { groups } = useGroupsContext();

  return (
    <Droppable droppableId="groups" type="group">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start"
        >
          {groups.map((group, idx) => (
            <TaskGroupCard key={group._id} group={group} index={idx} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
