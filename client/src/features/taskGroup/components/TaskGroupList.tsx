import { useState } from "react";
import { useGroups } from "../hooks/useGroups";
import { AddGroupForm } from "./AddGroupForm";
import { TaskGroupCard } from "./TaskGroupCard";
import {
  addTaskToGroup,
  deleteGroup,
  deleteTaskFromGroup,
  moveTaskToGroup,
  reorderGroups,
  reorderTasks,
  toggleTaskCompleted,
  updateGroupTitle,
  updateTaskTitle,
} from "../api/taskGroupApi";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

export const TaskGroupList = () => {
  const { groups, loading, reload, setGroups } = useGroups(true);
  const [taskTitles, setTaskTitles] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<{
    [groupId: string]: "all" | "completed" | "active";
  }>({});
  const [editingGroup, setEditingGroup] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [editingTask, setEditingTask] = useState<{
    groupId: string;
    taskId: string;
    title: string;
  } | null>(null);

  if (loading) return <p>Loading...</p>;

  const handleToggleTask = async (groupId: string, taskId: string) => {
    const prevGroups = groups;
    setGroups(
      groups.map((g) =>
        g._id !== groupId
          ? g
          : {
              ...g,
              tasks: g.tasks.map((t) =>
                t._id !== taskId ? t : { ...t, completed: !t.completed }
              ),
            }
      )
    );
    try {
      await toggleTaskCompleted(groupId, taskId);
    } catch {
      setGroups(prevGroups);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "group") {
      const newGroups = Array.from(groups);
      const [removed] = newGroups.splice(source.index, 1);
      newGroups.splice(destination.index, 0, removed);
      setGroups(newGroups);
      try {
        await reorderGroups(newGroups.map((g) => g._id));
      } catch (err) {
        console.error("Failed to reorder groups", err);
      }
      return;
    }

    if (type === "task") {
      const sourceIdx = groups.findIndex((g) => g._id === source.droppableId);
      const destIdx = groups.findIndex(
        (g) => g._id === destination.droppableId
      );
      if (sourceIdx === -1 || destIdx === -1) return;

      const sourceTasks = Array.from(groups[sourceIdx].tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      const newGroups = [...groups];

      if (source.droppableId === destination.droppableId) {
        sourceTasks.splice(destination.index, 0, removed);
        newGroups[sourceIdx].tasks = sourceTasks;
        setGroups(newGroups);
        try {
          await reorderTasks(
            source.droppableId,
            sourceTasks.map((t) => t._id)
          );
        } catch (err) {
          console.error("Failed to reorder tasks in same group", err);
        }
      } else {
        const destTasks = Array.from(groups[destIdx].tasks);
        destTasks.splice(destination.index, 0, removed);
        newGroups[sourceIdx].tasks = sourceTasks;
        newGroups[destIdx].tasks = destTasks;
        setGroups(newGroups);
        try {
          await moveTaskToGroup(
            source.droppableId,
            removed._id,
            destination.droppableId
          );
          await reorderTasks(
            destination.droppableId,
            destTasks.map((t) => t._id)
          );
        } catch (err) {
          console.error(
            "Failed to move or reorder task in different group",
            err
          );
        }
      }
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <AddGroupForm onCreate={() => reload?.()} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="groups" type="group">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                  handlers={{
                    reload,
                    handleToggleTask,
                    deleteGroup,
                    updateGroupTitle,
                    addTaskToGroup,
                    deleteTaskFromGroup,
                    updateTaskTitle,
                  }}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
