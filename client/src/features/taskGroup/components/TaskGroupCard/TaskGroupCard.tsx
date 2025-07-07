import { Draggable } from "@hello-pangea/dnd";
import { AddTaskInput } from "../AddTaskInput";
import { useTaskGroupCard } from "./useTaskGroupCard";
import { GroupHeader } from "./GroupHeader";
import { TaskList } from "./TaskList";
import { FilterButtons } from "./FilterButtons";
import type { Props } from "./TaskGroupCard.types";

export const TaskGroupCard = ({
  group,
  index,
  taskTitles,
  setTaskTitles,
  filter,
  setFilter,
  editingGroup,
  setEditingGroup,
  editingTask,
  setEditingTask,
  handlers,
}: Props) => {
  const {
    isEditingGroup,
    filteredTasks,
    handleGroupEditSubmit,
    handleDeleteGroup,
    handleFilterChange,
  } = useTaskGroupCard({
    group,
    filter,
    editingGroup,
    handlers,
    setEditingGroup,
    setFilter,
  });

  return (
    <Draggable draggableId={group._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex flex-col rounded-2xl bg-white dark:bg-zinc-700 shadow-lg p-4 transition-transform hover:scale-[1.02]"
        >
          <div {...provided.dragHandleProps}>
            <GroupHeader
              groupId={group._id}
              title={group.title}
              isEditing={isEditingGroup}
              editingGroup={editingGroup}
              setEditingGroup={setEditingGroup}
              handleGroupEditSubmit={handleGroupEditSubmit}
              handleDeleteGroup={handleDeleteGroup}
            />
          </div>

          <TaskList
            groupId={group._id}
            tasks={filteredTasks}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            handlers={handlers}
          />

          <AddTaskInput
            groupId={group._id}
            value={taskTitles[group._id] || ""}
            onChange={(val) =>
              setTaskTitles((prev) => ({ ...prev, [group._id]: val }))
            }
            onAdd={async (groupId, title) => {
              await handlers.addTaskToGroup(groupId, title);
            }}
            reload={handlers.reload ?? (() => {})}
          />

          <FilterButtons onChange={handleFilterChange} />
        </div>
      )}
    </Draggable>
  );
};
