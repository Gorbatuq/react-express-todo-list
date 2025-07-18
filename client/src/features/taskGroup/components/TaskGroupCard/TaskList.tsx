import { Droppable } from "@hello-pangea/dnd";
import { TaskItem } from "../TaskItem/TaskItem";
import type { Task } from "../../model/types";
import { useGroupsContext } from "../contexts/GroupsContext";

export const TaskList = ({
  groupId,
  tasks,
}: {
  groupId: string;
  tasks: Task[];
}) => {
  const { handlers } = useGroupsContext();

  const handleToggle = (groupId: string, taskId: string) => {
    handlers.handleToggleTask(groupId, taskId);
    handlers.reload?.();
  };

  const handleDelete = async (groupId: string, taskId: string) => {
    await handlers.deleteTaskFromGroup(groupId, taskId);
    handlers.reload?.();
  };

  const handleEditSubmit = async (
    groupId: string,
    taskId: string,
    title: string
  ) => {
    await handlers.updateTaskTitle(groupId, taskId, title);
    handlers.reload?.();
  };

  return (
    <Droppable droppableId={groupId} type="task">
      {(provided) => (
        <ul
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="space-y-2 mb-4"
        >
          {tasks.map((task, idx) => (
            <TaskItem
              key={task._id}
              task={task}
              groupId={groupId}
              index={idx}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEditSubmit={handleEditSubmit}
            />
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};
