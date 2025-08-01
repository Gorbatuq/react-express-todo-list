import { create } from "zustand";
import { groupApi } from "../api/groups";
import type { TaskGroup } from "../types";

type GroupStore = {
  groupIds: string[];
  groupMap: Record<string, TaskGroup>;
  loading: boolean;
  hasLoaded: boolean;
  editingGroupId: string | null;

  reload: () => Promise<void>;
  createGroup: (title: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  updateGroupTitle: (id: string, title: string) => Promise<void>;
  reorderGroups: (ids: string[]) => Promise<void>;
  setEditingGroupId: (id: string | null) => void;
};

export const useGroupStore = create<GroupStore>((set, get) => ({
  groupIds: [],
  groupMap: {},
  loading: true,
  hasLoaded: false,
  editingGroupId: null,

  reload: async () => {
    try {
      set({ loading: true });
      const groups = await groupApi.getAll();
      set({
        groupMap: Object.fromEntries(groups.map((g) => [g._id, g])),
        groupIds: groups.map((g) => g._id),
        loading: false,
        hasLoaded: true,
      });
    } catch (err) {
      set({ loading: false });
      console.error("❌ Failed to reload groups", err);
      throw err;
    }
  },

  createGroup: async (title) => {
    try {
      const newGroup = await groupApi.create(title);
      set((s) => ({
        groupMap: { ...s.groupMap, [newGroup._id]: newGroup },
        groupIds: [...s.groupIds, newGroup._id],
      }));
    } catch (err) {
      console.error("❌ Failed to create group", err);
      throw err;
    }
  },

  deleteGroup: async (id) => {
    try {
      await groupApi.delete(id);
      set((s) => {
        const { [id]: _, ...rest } = s.groupMap;
        return {
          groupMap: rest,
          groupIds: s.groupIds.filter((gid) => gid !== id),
        };
      });
    } catch (err) {
      console.error("❌ Failed to delete group", err);
      throw err;
    }
  },

  updateGroupTitle: async (id, title) => {
    try {
      const updated = await groupApi.updateTitle(id, title);
      set((s) => ({
        groupMap: { ...s.groupMap, [id]: updated },
      }));
    } catch (err) {
      console.error("❌ Failed to update group title", err);
      throw err;
    }
  },

  reorderGroups: async (ids) => {
    
    const prevIds = get().groupIds;
          console.log("REORDERING", prevIds);
    try {
      set({ groupIds: ids });
      await groupApi.reorder(ids);
    } catch (err) {
      set({ groupIds: prevIds });
          console.log("REORDERING", prevIds);
      console.error("❌ Failed to reorder groups", err);
      throw err;
    }
  },

  setEditingGroupId: (id) => set({ editingGroupId: id }),
}));
