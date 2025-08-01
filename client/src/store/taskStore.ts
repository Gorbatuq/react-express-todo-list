import { create } from "zustand";
import { taskApi } from "../api/task";
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

  reorderTasksLocally: (groupId: string, taskId: string, toIndex: number) => Promise<void>;
  moveTaskToAnotherGroup: (
    sourceId: string,
    taskId: string,
    targetId: string,
    toIndex: number
  ) => Promise<void>;

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
    console.log("Deleting", groupId, taskId);

    set((s) => ({
      tasksByGroup: {
        ...s.tasksByGroup,
        [groupId]: (s.tasksByGroup[groupId] || []).filter((t) => t._id !== taskId),
      },
    }));
  },

  updateTitle: async (groupId, taskId, title) => {
    const updated = await taskApi.update(groupId, taskId, { title });
    console.log("updated task", groupId, taskId, title);
    
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
    const task = prev[groupId]?.find((t) => t._id === taskId);
    console.log("Toggle", groupId, taskId);

    if (!task) return;

    const updatedTasks = prev[groupId].map((t) =>
      t._id === taskId ? { ...t, completed: !t.completed } : t
    );

    set({ tasksByGroup: { ...prev, [groupId]: updatedTasks } });

    try {
      await taskApi.update(groupId, taskId, { completed: !task.completed });
    } catch {
      set({ tasksByGroup: prev });
    }
  },


  reorderTasksLocally: async (groupId, taskId, toIndex) => {
    const prev = get().tasksByGroup;
    console.log("Reorder", groupId, taskId, toIndex);

    const tasks = [...(prev[groupId] || [])];
    const index = tasks.findIndex((t) => t._id === taskId);
    if (index === -1) return;

    const [task] = tasks.splice(index, 1);
    tasks.splice(toIndex, 0, task);

    const updated = {
      ...prev,
      [groupId]: tasks,
    };

    set({ tasksByGroup: updated });

    try {
      await taskApi.reorder(groupId, tasks.map((t) => t._id));
    } catch {
      set({ tasksByGroup: prev });
    }
  },

  moveTaskToAnotherGroup: async (sourceId, taskId, targetId, toIndex) => {
    const prev = get().tasksByGroup;

    const sourceTasks = [...(prev[sourceId] || [])];
    const targetTasks = [...(prev[targetId] || [])];

    const task = sourceTasks.find((t) => t._id === taskId);
    if (!task) return;

    const updatedSource = sourceTasks.filter((t) => t._id !== taskId);
    const newTask = { ...task, groupId: targetId };
    const updatedTarget = [...targetTasks];
    updatedTarget.splice(toIndex, 0, newTask);

    set({
      tasksByGroup: {
        ...prev,
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
    const { source, destination, draggableId, type } = result;
    if (!destination || type !== "task") return;

    const sourceId = source.droppableId;
    const targetId = destination.droppableId;

    if (sourceId === targetId) {
      get().reorderTasksLocally(sourceId, draggableId, destination.index);
    } else {
      get().moveTaskToAnotherGroup(sourceId, draggableId, targetId, destination.index);
    }
  },
}));
