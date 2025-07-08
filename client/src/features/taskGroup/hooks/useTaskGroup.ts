import { useState } from "react";
import { useGroups } from "./useGroups";
import { groupApi } from "../api/groups";
import { taskApi } from "../api/task";
import type { DropResult } from "@hello-pangea/dnd";
import type { TaskGroup } from "../model/types";

interface UseTaskGroupsReturn {
  groups: TaskGroup[];
  setGroups: React.Dispatch<React.SetStateAction<TaskGroup[]>>;
  loading: boolean;
  reload: (() => Promise<void>) | undefined;
  taskTitles: Record<string, string>;
  setTaskTitles: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  filter: Record<string, "all" | "completed" | "active">;
  setFilter: React.Dispatch<React.SetStateAction<Record<string, "all" | "completed" | "active">>>;
  editingGroup: { id: string; title: string } | null;
  setEditingGroup: React.Dispatch<React.SetStateAction<{ id: string; title: string } | null>>;
  editingTask: { groupId: string; taskId: string; title: string } | null;
  setEditingTask: React.Dispatch<React.SetStateAction<{ groupId: string; taskId: string; title: string } | null>>;
  handleToggleTask: (groupId: string, taskId: string) => Promise<void>;
  onDragEnd: (result: DropResult) => Promise<void>;
}

export const useTaskGroups = (): UseTaskGroupsReturn => {
  const { groups, loading, reload, setGroups } = useGroups(true);
  const [taskTitles, setTaskTitles] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Record<string, "all" | "completed" | "active">>({});
  const [editingGroup, setEditingGroup] = useState<{ id: string; title: string } | null>(null);
  const [editingTask, setEditingTask] = useState<{ groupId: string; taskId: string; title: string } | null>(null);

  const handleToggleTask = async (groupId: string, taskId: string) => {
    const prevGroups = groups;
    setGroups(groups.map((g) =>
      g._id !== groupId
        ? g
        : { ...g, tasks: g.tasks.map((t) =>
          t._id !== taskId ? t : { ...t, completed: !t.completed }
        )}
    ));
    try {
      await taskApi.toggle(groupId, taskId);
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
        await groupApi.reorder(newGroups.map((g) => g._id));
      } catch (err) {
        console.error("Failed to reorder groups", err);
      }
      return;
    }

    if (type === "task") {
      const sourceIdx = groups.findIndex((g) => g._id === source.droppableId);
      const destIdx = groups.findIndex((g) => g._id === destination.droppableId);
      if (sourceIdx === -1 || destIdx === -1) return;

      const sourceTasks = Array.from(groups[sourceIdx].tasks);
      const [removed] = sourceTasks.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceTasks.splice(destination.index, 0, removed);
        const newGroups = groups.map((g, i) =>
          i === sourceIdx ? { ...g, tasks: sourceTasks } : g
        );
        setGroups(newGroups);

        try {
          await taskApi.reorder(
            source.droppableId,
            sourceTasks.map((t) => t._id)
          );
        } catch (err) {
          console.error("Failed reorder", err);
        }
      } else {
        const destTasks = Array.from(groups[destIdx].tasks);
        const movedTask = { ...removed, groupId: destination.droppableId };
        destTasks.splice(destination.index, 0, movedTask);

        const newGroups = groups.map((g, i) => {
          if (i === sourceIdx) return { ...g, tasks: sourceTasks };
          if (i === destIdx) return { ...g, tasks: destTasks };
          return g;
        });

        const previousGroups = groups;
        setGroups(newGroups);

        try {
          await taskApi.move(
            source.droppableId,
            removed._id,
            destination.droppableId
          );
          await taskApi.reorder(
            destination.droppableId,
            destTasks.map((t) => t._id)
          );
        } catch (err) {
          console.error("Move or reorder failed", err);
          setGroups(previousGroups);
        }
      }
    }
  };

  return {
    groups, setGroups, loading, reload,
    taskTitles, setTaskTitles,
    filter, setFilter,
    editingGroup, setEditingGroup,
    editingTask, setEditingTask,
    handleToggleTask, onDragEnd
  };
};
