import { Draggable } from "@hello-pangea/dnd";
import { AddTaskInput } from "../AddTask/AddTaskInput";
import { GroupHeader } from "./GroupHeader";
import { TaskList } from "./TaskList";
import { FilterButtons } from "./FilterButtons";
import { useGroupStore } from "@/store/groupStore";
import { useTaskGroupCardLogic } from "../../hooks/useTaskGroupCardLogic";
import React from "react";

export const TaskGroupCard = React.memo(
  ({ groupId, index }: { groupId: string; index: number }) => {
    const group = useGroupStore((s) => s.groupMap[groupId]);
    const editingGroupId = useGroupStore((s) => s.editingGroupId);
    const setEditingGroupId = useGroupStore((s) => s.setEditingGroupId);
    const updateGroupTitle = useGroupStore((s) => s.updateGroupTitle);
    const deleteGroup = useGroupStore((s) => s.deleteGroup);

    const isEditingGroup = editingGroupId === groupId;
    const { title, setTitle, filter, setFilter, filteredTasks, handleAdd } =
      useTaskGroupCardLogic(groupId);

    if (!group) return null;

    const handleGroupEditSubmit = async (newTitle: string) => {
      await updateGroupTitle(groupId, newTitle);
      setEditingGroupId(null);
    };

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
                setEditingGroupId={setEditingGroupId}
                handleGroupEditSubmit={handleGroupEditSubmit}
                handleDeleteGroup={() => deleteGroup(groupId)}
              />
            </div>

            <TaskList groupId={group._id} tasks={filteredTasks} />
            <AddTaskInput value={title} onChange={setTitle} onAdd={handleAdd} />
            <FilterButtons currentFilter={filter} onChange={setFilter} />
          </div>
        )}
      </Draggable>
    );
  }
);
