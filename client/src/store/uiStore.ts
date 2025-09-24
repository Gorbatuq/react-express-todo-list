import { create } from "zustand";

type Filter = "all" | "active" | "completed";

type UIState = {
  // filter
  filter: Filter;
  setFilter: (filter: Filter) => void;

  // dragging
  draggingTaskId: string | null;
  setDraggingTask: (id: string | null) => void;

  draggingGroupId: string | null;
  setDraggingGroup: (id: string | null) => void;

  // editing
  editingGroupId: string | null;
  setEditingGroupId: (id: string | null) => void;

  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  // filter
  filter: "all",
  setFilter: (filter) => set({ filter }),

  // dragging
  draggingTaskId: null,
  setDraggingTask: (id) => set({ draggingTaskId: id }),

  draggingGroupId: null,
  setDraggingGroup: (id) => set({ draggingGroupId: id }),

  // editing
  editingGroupId: null,
  setEditingGroupId: (id) => set({ editingGroupId: id }),

  editingTaskId: null,
  setEditingTaskId: (id) => set({ editingTaskId: id }),
}));
