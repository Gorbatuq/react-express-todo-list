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
  const updateGroupMutate = updateGroup.mutate;
  const deleteGroupMutate = deleteGroup.mutate;
  const updateTaskMutate = updateTask.mutate;
  const deleteTaskMutate = deleteTask.mutate;

  const { filter, setFilter, filteredTasks } = useGroupFilter(group.id, tasks);

  const copyGroupTasks = React.useCallback(async () => {
    const text = [group.title, ...tasks.map((task) => task.title)].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Group copied");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy group");
    }
  }, [group.title, tasks]);

  const handleGroupSubmit = React.useCallback(
    (title: string, priority: typeof group.priority) => {
      updateGroupMutate({ groupId: group.id, data: { title, priority } });
    },
    [group.id, updateGroupMutate],
  );

  const handleGroupDelete = React.useCallback(() => {
    deleteGroupMutate(group.id);
  }, [deleteGroupMutate, group.id]);

  const handleTaskToggle = React.useCallback(
    (taskId: string, completed: boolean) => {
      updateTaskMutate({
        groupId: group.id,
        taskId,
        payload: { completed },
      });
    },
    [group.id, updateTaskMutate],
  );

  const handleTaskDelete = React.useCallback(
    (taskId: string) => {
      deleteTaskMutate({ groupId: group.id, taskId });
    },
    [deleteTaskMutate, group.id],
  );

  const handleTaskEditSubmit = React.useCallback(
    (taskId: string, title: string) => {
      updateTaskMutate({
        groupId: group.id,
        taskId,
        payload: { title },
      });
    },
    [group.id, updateTaskMutate],
  );

  return (
    <div className="app-card app-card-hover flex w-full min-w-0 flex-col p-4">
      <GroupHeader
        title={group.title}
        priority={group.priority}
        dragHandleProps={dragHandleProps}
        onSubmit={handleGroupSubmit}
        onDelete={handleGroupDelete}
        onCopy={copyGroupTasks}
      />

      <TaskList
        groupId={group.id}
        tasks={filteredTasks}
        onToggle={handleTaskToggle}
        onDelete={handleTaskDelete}
        onEditSubmit={handleTaskEditSubmit}
      />

      <AddTaskForm groupId={group.id} />
      {tasks.length > 0 && (
        <FilterButtons currentFilter={filter} onChange={setFilter} />
      )}
    </div>
  );
});
