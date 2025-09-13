import { AddTaskForm } from "../AddTask/AddTaskForm";
import { GroupHeader } from "./GroupHeader";
import { TaskList } from "./TaskList";
import { FilterButtons } from "./FilterButtons";
import { useGroupStore } from "@/store/groupStore";
import { useTaskGroupCardLogic } from "../../hooks/useTaskGroupCardLogic";
import React from "react";
import type { Priority } from "@/types";

export const TaskGroupCard = React.memo(({ groupId }: { groupId: string }) => {
  const group = useGroupStore((s) => s.groupMap[groupId]);
  const editingGroupId = useGroupStore((s) => s.editingGroupId);
  const setEditingGroupId = useGroupStore((s) => s.setEditingGroupId);
  const updateGroup = useGroupStore((s) => s.updateGroup);
  const deleteGroup = useGroupStore((s) => s.deleteGroup);

  const isEditingGroup = editingGroupId === groupId;
  const { filter, setFilter, filteredTasks, handleAdd } =
    useTaskGroupCardLogic(groupId);

  if (!group) return null;

  const handleGroupEditSubmit = async (
    newTitle: string,
    newPriority: Priority
  ) => {
    await updateGroup(groupId, { title: newTitle, priority: newPriority });
    setEditingGroupId(null);
  };

  return (
    <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-700 shadow-lg p-4 transition-shadow hover:shadow-xl">
      <GroupHeader
        groupId={group.id}
        title={group.title}
        priority={group.priority}
        isEditing={isEditingGroup}
        setEditingGroupId={setEditingGroupId}
        handleGroupEditSubmit={handleGroupEditSubmit}
        handleDeleteGroup={() => deleteGroup(groupId)}
      />
      <TaskList groupId={group.id} tasks={filteredTasks} />
      <AddTaskForm addTask={handleAdd} />
      <FilterButtons currentFilter={filter} onChange={setFilter} />
    </div>
  );
});
