import { create } from "zustand";
import { groupApi } from "../api/groups";
import type { TaskGroup } from "../types";
import toast from "react-hot-toast";
import { queryClient } from "../lib/queryClient";
import { useTaskStore } from "./taskStore";

type Priority = 1 | 2 | 3 | 4;

type CreateGroupDto = {
  title: string;
  priority?: Priority;
};

type UpdateGroupDto = Partial<CreateGroupDto>;

type GroupStore = {
  groupIds: string[];
  groupMap: Record<string, TaskGroup>;
  loading: boolean;
  hasLoaded: boolean;
  editingGroupId: string | null;

  reload: () => Promise<void>;
  createGroup: (title: string, priority?: Priority) => Promise<TaskGroup>;
  deleteGroup: (id: string) => Promise<void>;
  updateGroup: (id: string, data: UpdateGroupDto) => Promise<void>;
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
    console.log("🔄 [groupStore] Reloading groups...");
    try {
      set({ loading: true });
      const groups = (await groupApi.getAll()).filter((g) => !!g.id);

      console.log("✅ [groupStore] Groups fetched:", groups);
      set({
        groupMap: Object.fromEntries(groups.map((g) => [g.id, g])),
        groupIds: groups.map((g) => g.id).filter((id): id is string => typeof id === "string"),
        loading: false,
        hasLoaded: true,
      });
    } catch (err) {
      console.error("❌ [groupStore] Failed to reload groups", err);
      set({ loading: false });
      throw err;
    }
  },

  createGroup: async (title, priority = 2) => {
    console.log(`➕ [groupStore] Creating group: "${title}", priority: ${priority}`);
    const prev = get();
    try {
      const newGroup = await groupApi.create({ title, priority });
      console.log("🧪 newGroup response:", newGroup);
      if (!newGroup.id) throw new Error("Invalid group object");

      console.log("✅ [groupStore] Group created:", newGroup);
      set((s) => ({
        groupMap: { ...s.groupMap, [newGroup.id]: newGroup },
        groupIds: [...s.groupIds, newGroup.id],
      }));

      console.log("📦 [groupStore] Loading tasks for group:", newGroup.id);
      await useTaskStore.getState().loadTasks(newGroup.id);

      await queryClient.invalidateQueries({ queryKey: ["groups"] });
      console.log("🔃 [groupStore] Invalidated group query");

      return newGroup;
    } catch (err: any) {
      console.error("❌ [groupStore] Failed to create group", err);
      set(prev);
      if (err.response?.status === 403) {
        toast.error("A guest can only create 3 groups");
      } else {
        toast.error("Unable to create group");
      }
      throw err;
    }
  },

  deleteGroup: async (id) => {
    console.log(`🗑 [groupStore] Deleting group: ${id}`);
    try {
      await groupApi.delete(id);
      set((s) => {
        const { [id]: _, ...rest } = s.groupMap;
        return {
          groupMap: rest,
          groupIds: s.groupIds.filter((gid) => gid !== id),
        };
      });
      console.log(`✅ [groupStore] Deleted group: ${id}`);
    } catch (err) {
      console.error("❌ [groupStore] Failed to delete group", err);
      throw err;
    }
  },

  updateGroup: async (id, data) => {
    console.log(`✏️ [groupStore] Updating group ${id} with:`, data);
    try {
      const updated = await groupApi.update(id, data);
      set((s) => ({
        groupMap: { ...s.groupMap, [id]: updated },
      }));
      console.log(`✅ [groupStore] Group ${id} updated:`, updated);
    } catch (err) {
      console.error("❌ [groupStore] Failed to update group data", err);
      throw err;
    }
  },

  reorderGroups: async (ids) => {
    console.log("🔀 [groupStore] Reordering groups:", ids);
    const prevIds = get().groupIds;
    try {
      set({ groupIds: ids });
      await groupApi.reorder(ids);
      console.log("✅ [groupStore] Groups reordered");
    } catch (err) {
      set({ groupIds: prevIds });
      console.error("❌ [groupStore] Failed to reorder groups", err);
      throw err;
    }
  },

  setEditingGroupId: (id) => {
    console.log("✏️ [groupStore] Set editingGroupId:", id);
    set({ editingGroupId: id });
  },
}));
