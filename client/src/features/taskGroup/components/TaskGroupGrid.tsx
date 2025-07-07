import { Droppable } from "@hello-pangea/dnd";
import { TaskGroupCard } from "./TaskGroupCard/TaskGroupCard";
import type { Props } from "./TaskGroupCard/TaskGroupCard.types";

interface GridProps {
  groups: Props["group"][];
  taskTitles: Props["taskTitles"];
  setTaskTitles: Props["setTaskTitles"];
  filter: Props["filter"];
  setFilter: Props["setFilter"];
  editingGroup: Props["editingGroup"];
  setEditingGroup: Props["setEditingGroup"];
  editingTask: Props["editingTask"];
  setEditingTask: Props["setEditingTask"];
  handlers: Omit<Props["handlers"], "handleToggleTask"> & {
    handleToggleTask: Props["handlers"]["handleToggleTask"];
  };
}

export const TaskGroupGrid = ({
  groups,
  taskTitles,
  setTaskTitles,
  filter,
  setFilter,
  editingGroup,
  setEditingGroup,
  editingTask,
  setEditingTask,
  handlers,
}: GridProps) => (
  <Droppable droppableId="groups" type="group">
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start"
      >
        {groups.map((group, idx) => (
          <TaskGroupCard
            key={group._id}
            group={group}
            index={idx}
            taskTitles={taskTitles}
            setTaskTitles={setTaskTitles}
            filter={filter}
            setFilter={setFilter}
            editingGroup={editingGroup}
            setEditingGroup={setEditingGroup}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            handlers={handlers}
          />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);
