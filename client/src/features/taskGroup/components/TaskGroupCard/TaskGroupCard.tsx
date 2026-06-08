import React from "react";
import toast from "react-hot-toast";
import { useGroupMutations } from "../../hooks/queries/group/useGroupMutations";
import { useTasks } from "../../hooks/queries/task/useTasks";
import { useTaskMutations } from "../../hooks/queries/task/useTaskMutations";
import { useGroupFilter } from "../../hooks/useGroupFilter";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import type { TaskGroup } from "../../../../types";
import { AddTaskForm } from "../AddForms/AddTaskForm";
import { GroupHeader } from "./GroupHeader";
import { TaskList } from "./TaskList";
import { FilterButtons } from "./FilterButtons";

type Props = {
  group: TaskGroup;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

export const TaskGroupCard = React.memo(({ group, dragHandleProps }: Props) => {
  const { deleteGroup, updateGroup } = useGroupMutations();
  const { data: tasks = [] } = useTasks(group.id);
  const { updateTask, deleteTask } = useTaskMutations();

  const { filter, setFilter, filteredTasks } = useGroupFilter(tasks);

  const copyGroupTasks = async () => {
    const text = [group.title, ...tasks.map((task) => task.title)].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Group copied");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy group");
    }
  };

  return (
    <div className="app-card app-card-hover flex w-full min-w-0 flex-col p-4">
      <GroupHeader
        title={group.title}
        priority={group.priority}
        dragHandleProps={dragHandleProps}
        onSubmit={(title, priority) =>
          updateGroup.mutate({ groupId: group.id, data: { title, priority } })
        }
        onDelete={() => deleteGroup.mutate(group.id)}
        onCopy={copyGroupTasks}
      />

      <TaskList
        groupId={group.id}
        tasks={filteredTasks}
        onToggle={(taskId, completed) => {
          updateTask.mutate({
            groupId: group.id,
            taskId,
            payload: { completed },
          });
        }}
        onDelete={(taskId) => deleteTask.mutate({ groupId: group.id, taskId })}
        onEditSubmit={(taskId, title) => {
          updateTask.mutate({
            groupId: group.id,
            taskId,
            payload: { title },
          });
        }}
      />

      <AddTaskForm groupId={group.id} />
      {tasks.length > 0 && (
        <FilterButtons currentFilter={filter} onChange={setFilter} />
      )}
    </div>
  );
});
