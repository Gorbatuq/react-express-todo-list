// src/store/ui/editingStore.ts
import { create } from "zustand";
type EditingState = {
  editingGroupId: string | null;
  editingTaskId: string | null;
  setEditingGroupId: (id: string | null) => void;
  setEditingTaskId: (id: string | null) => void;
};
export const useEditingStore = create<EditingState>((set) => ({
  editingGroupId: null,
  editingTaskId: null,
  setEditingGroupId: (id) => set({ editingGroupId: id }),
  setEditingTaskId: (id) => set({ editingTaskId: id }),
}));
