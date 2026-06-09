import { create } from "zustand";
import type { FilterType } from "../../../types";

type GroupFilterState = {
  filtersByGroupId: Record<string, FilterType>;
  getFilter: (groupId: string) => FilterType;
  setFilter: (groupId: string, filter: FilterType) => void;
};

export const useGroupFilterStore = create<GroupFilterState>((set, get) => ({
  filtersByGroupId: {},
  getFilter: (groupId) => get().filtersByGroupId[groupId] ?? "all",
  setFilter: (groupId, filter) =>
    set((state) => ({
      filtersByGroupId: {
        ...state.filtersByGroupId,
        [groupId]: filter,
      },
    })),
}));
