// ✅ 1. Переписаний groupStore з нормалізацією
import { create } from "zustand";
import { groupApi } from "../features/taskGroup/api/groups";
import type { TaskGroup } from "../types";

type GroupStore = {
  groupIds: string[];
  groupMap: Record<string, TaskGroup>;
  loading: boolean;
  editingGroupId: string | null;

  reload: () => Promise<void>;
  createGroup: (title: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  updateGroupTitle: (id: string, title: string) => Promise<void>;
  reorderGroups: (ids: string[]) => Promise<void>;
  setEditingGroupId: (id: string | null) => void;
};

export const useGroupStore = create<GroupStore>((set) => ({
  groupIds: [],
  groupMap: {},
  loading: true,
  editingGroupId: null,

  reload: async () => {
    set({ loading: true });
    const groups = await groupApi.getAll();
    set({
      groupMap: Object.fromEntries(groups.map((g) => [g._id, g])),
      groupIds: groups.map((g) => g._id),
      loading: false,
    });
  },

  createGroup: async (title) => {
    const newGroup = await groupApi.create(title);
    set((s) => ({
      groupMap: { ...s.groupMap, [newGroup._id]: newGroup },
      groupIds: [...s.groupIds, newGroup._id],
    }));
  },

  deleteGroup: async (id) => {
    await groupApi.delete(id);
    set((s) => {
      const { [id]: _, ...rest } = s.groupMap;
      return {
        groupMap: rest,
        groupIds: s.groupIds.filter((gid) => gid !== id),
      };
    });
  },

  updateGroupTitle: async (id, title) => {
    const updated = await groupApi.updateTitle(id, title);
    set((s) => ({
      groupMap: { ...s.groupMap, [id]: updated },
    }));
  },

  reorderGroups: async (ids) => {
    await groupApi.reorder(ids);
    set({ groupIds: ids });
  },

  setEditingGroupId: (id) => set({ editingGroupId: id }),
}));
