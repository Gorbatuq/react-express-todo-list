import { create } from "zustand";
import { groupApi } from "../api/groups";
import type { Priority, TaskGroup } from "../types";
import toast from "react-hot-toast";
import { queryClient } from "../lib/queryClient";
import { useTaskStore } from "./taskStore";

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
    try {
      set({ loading: true });
      const groups = (await groupApi.getAll()).filter((g) => !!g.id);

      set({
        groupMap: Object.fromEntries(groups.map((g) => [g.id, g])),
        groupIds: groups
          .map((g) => g.id)
          .filter((id): id is string => typeof id === "string"),
        loading: false,
        hasLoaded: true,
      });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  createGroup: async (title, priority = 2) => {
    const prev = get();
    try {
      const newGroup = await groupApi.create({ title, priority });
      if (!newGroup.id) throw new Error("Invalid group object");

      set((s) => ({
        groupMap: { ...s.groupMap, [newGroup.id]: newGroup },
        groupIds: [...s.groupIds, newGroup.id],
      }));

      await useTaskStore.getState().loadTasks(newGroup.id);
      await queryClient.invalidateQueries({ queryKey: ["groups"] });

      return newGroup;
    } catch (err: any) {
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
      throw err;
    }
  },

  updateGroup: async (id, data) => {
    try {
      const updated = await groupApi.update(id, data);
      set((s) => ({
        groupMap: { ...s.groupMap, [id]: updated },
      }));
    } catch (err) {
      throw err;
    }
  },

  reorderGroups: async (ids) => {
    const prevIds = get().groupIds;
    try {
      set({ groupIds: ids });
      await groupApi.reorder(ids);
    } catch (err) {
      set({ groupIds: prevIds });
      throw err;
    }
  },

  setEditingGroupId: (id) => {
    set({ editingGroupId: id });
  },
}));
