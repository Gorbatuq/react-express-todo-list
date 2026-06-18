import React from "react";
import toast from "react-hot-toast";
import { useGroupMutations } from "../../hooks/groups/useGroupMutations";
import { useTasks } from "../../hooks/tasks/useTasks";
import { useTaskMutations } from "../../hooks/tasks/useTaskMutations";
import { useGroupFilter } from "../../hooks/useGroupFilter";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import type { TaskGroup } from "../../../../types";
import { AddTaskForm } from "../AddForms/AddTaskForm";
import { GroupHeader } from "./GroupHeader";
import { TaskList } from "./TaskList";
import { FilterButtons } from "./FilterButtons";
import { GroupCobwebOverlay } from "./GroupCobwebOverlay";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { useCobwebDismissal } from "../../hooks/useCobwebDismissal";
import { useTaskListCollapse } from "../../hooks/useTaskListCollapse";

type Props = {
  group: TaskGroup;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

export const TaskGroupCard = React.memo(({ group, dragHandleProps }: Props) => {
  const { deleteGroup, updateGroup } = useGroupMutations();
  const tasksQuery = useTasks(group.id);
  const tasks = tasksQuery.data ?? [];
  const { updateTask, deleteTask } = useTaskMutations();
  const updateGroupMutate = updateGroup.mutate;
  const deleteGroupMutate = deleteGroup.mutate;
  const updateTaskMutate = updateTask.mutate;
  const deleteTaskMutate = deleteTask.mutate;

  const { filter, setFilter, filteredTasks } = useGroupFilter(group.id, tasks);
  const cobweb = useCobwebDismissal(group.updatedAt);
  const taskListCollapse = useTaskListCollapse({
    groupId: group.id,
    isTasksLoaded: tasksQuery.isSuccess,
    taskCount: tasks.length,
  });

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
    <div
      className="app-card app-card-hover relative flex w-full min-w-0 flex-col p-4"
      onClick={cobweb.dismiss}
    >
      <GroupCobwebOverlay
        updatedAt={group.updatedAt}
        dismissed={cobweb.isDismissed}
      />
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
        isCollapsed={
          taskListCollapse.canCollapse && taskListCollapse.isCollapsed
        }
        onExpand={taskListCollapse.expand}
        onToggle={handleTaskToggle}
        onDelete={handleTaskDelete}
        onEditSubmit={handleTaskEditSubmit}
      />

      {taskListCollapse.canCollapse && (
        <button
          type="button"
          aria-expanded={!taskListCollapse.isCollapsed}
          onClick={taskListCollapse.toggle}
          className="mb-3 inline-flex items-center justify-center gap-1 self-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
        >
          {taskListCollapse.isCollapsed ? (
            <>
              <MdExpandMore className="text-lg" />
              Show tasks
            </>
          ) : (
            <>
              <MdExpandLess className="text-lg" />
              Collapse tasks
            </>
          )}
        </button>
      )}

      <AddTaskForm groupId={group.id} />
      {tasks.length > 0 && (
        <FilterButtons currentFilter={filter} onChange={setFilter} />
      )}
    </div>
  );
});
