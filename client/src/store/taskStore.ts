import { create } from "zustand";
import { taskApi } from "../features/taskGroup/api/task";
import type { DropResult } from "@hello-pangea/dnd";
import type { Task } from "../types";

interface TaskState {
  tasksByGroup: Record<string, Task[]>;
  editingTaskId: string | null;

  loadTasks: (groupId: string) => Promise<void>;

  setEditingTaskId: (id: string | null) => void;
  addTask: (groupId: string, title: string) => Promise<void>;
  deleteTask: (groupId: string, taskId: string) => Promise<void>;
  updateTitle: (groupId: string, taskId: string, title: string) => Promise<void>;
  toggle: (groupId: string, taskId: string) => Promise<void>;
  reorder: (groupId: string, taskIds: string[]) => Promise<void>;
  move: (sourceId: string, taskId: string, targetId: string, position: number) => Promise<void>;

  onDragEnd: (result: DropResult) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasksByGroup: {},
  editingTaskId: null,

  setEditingTaskId: (id) => set({ editingTaskId: id }),


    loadTasks: async (groupId) => {
    const tasks = await taskApi.getByGroupId(groupId);
    set((s) => ({
      tasksByGroup: {
        ...s.tasksByGroup,
        [groupId]: tasks,
      },
    }));
  },

  addTask: async (groupId, title) => {
    const newTask = await taskApi.add(groupId, title);
    set((s) => ({
      tasksByGroup: {
        ...s.tasksByGroup,
        [groupId]: [...(s.tasksByGroup[groupId] || []), newTask],
      },
    }));
  },
  

  deleteTask: async (groupId, taskId) => {
    await taskApi.delete(groupId, taskId);
    set((s) => ({
      tasksByGroup: {
        ...s.tasksByGroup,
        [groupId]: (s.tasksByGroup[groupId] || []).filter((t) => t._id !== taskId),
      },
    }));
  },

  updateTitle: async (groupId, taskId, title) => {
    const updated = await taskApi.updateTitle(groupId, taskId, title);
    set((s) => ({
      tasksByGroup: {
        ...s.tasksByGroup,
        [groupId]: (s.tasksByGroup[groupId] || []).map((t) =>
          t._id === taskId ? { ...t, title: updated.title } : t
        ),
      },
    }));
  },

  toggle: async (groupId, taskId) => {
    const prev = get().tasksByGroup;
    const updated = (prev[groupId] || []).map((t) =>
      t._id === taskId ? { ...t, completed: !t.completed } : t
    );
    set({ tasksByGroup: { ...prev, [groupId]: updated } });
    try {
      await taskApi.toggle(groupId, taskId);
    } catch (e) {
      set({ tasksByGroup: prev });
    }
  },

  reorder: async (groupId, taskIds) => {
    await taskApi.reorder(groupId, taskIds);
    set((s) => {
      const tasks = taskIds.map((id) =>
        (s.tasksByGroup[groupId] || []).find((t) => t._id === id)!
      );
      return {
        tasksByGroup: {
          ...s.tasksByGroup,
          [groupId]: tasks,
        },
      };
    });
  },

  move: async (sourceId, taskId, targetId, position) => {
    const state = get();
    const prev = state.tasksByGroup;

    const sourceTasks = [...(state.tasksByGroup[sourceId] || [])];
    const targetTasks = [...(state.tasksByGroup[targetId] || [])];
    const task = sourceTasks.find((t) => t._id === taskId);
    if (!task) return;

    const updatedSource = sourceTasks.filter((t) => t._id !== taskId);
    const updatedTarget = [...targetTasks];
    updatedTarget.splice(position, 0, { ...task, groupId: targetId });

    set({
      tasksByGroup: {
        ...state.tasksByGroup,
        [sourceId]: updatedSource,
        [targetId]: updatedTarget,
      },
    });

    try {
      await taskApi.move(sourceId, taskId, targetId);
      await taskApi.reorder(targetId, updatedTarget.map((t) => t._id));
    } catch {
      set({ tasksByGroup: prev });
    }
  },

  onDragEnd: (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    get().move(
      source.droppableId.toString(),
      draggableId.toString(),
      destination.droppableId.toString(),
      destination.index
    );
  },
}));