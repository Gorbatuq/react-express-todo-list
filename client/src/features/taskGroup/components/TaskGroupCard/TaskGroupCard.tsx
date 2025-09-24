import { AddTaskForm } from "../AddTask/AddTaskForm";
import { GroupHeader } from "./GroupHeader";
import { TaskList } from "./TaskList";
import { FilterButtons } from "./FilterButtons";

import React from "react";
import type { TaskGroup } from "@/types";
import { useGroupMutations } from "../../hooks/queries/group/useGroupMutations";
import { useTasks } from "../../hooks/queries/task/useTasks";
import { useTaskMutations } from "../../hooks/queries/task/useTaskMutations";
import { useUIStore } from "@/store/uiStore";

type Props = {
  group: TaskGroup;
};

export const TaskGroupCard = React.memo(({ group }: Props) => {
  const { deleteGroup, updateGroup } = useGroupMutations();
  const { data: tasks = [] } = useTasks(group.id);
  const { updateTask, deleteTask } = useTaskMutations();

  const filter = useUIStore((s) => s.filter);
  const setFilter = useUIStore((s) => s.setFilter);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-700 shadow-lg p-4 transition-shadow hover:shadow-xl">
      <GroupHeader
        title={group.title}
        priority={group.priority}
        onSubmit={(title, priority) =>
          updateGroup.mutate({ groupId: group.id, data: { title, priority } })
        }
        onDelete={() => deleteGroup.mutate(group.id)}
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
      <FilterButtons currentFilter={filter} onChange={setFilter} />
    </div>
  );
});
