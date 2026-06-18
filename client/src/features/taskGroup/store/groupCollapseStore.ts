import { create } from "zustand";

const STORAGE_KEY = "taskGroupCollapsedIds";

const readCollapsedGroupIds = () => {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return {};

    const value = JSON.parse(rawValue);
    if (!Array.isArray(value)) return {};

    return Object.fromEntries(
      value.filter((groupId): groupId is string => typeof groupId === "string")
        .map((groupId) => [groupId, true]),
    );
  } catch {
    return {};
  }
};

const writeCollapsedGroupIds = (collapsedByGroupId: Record<string, boolean>) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      Object.entries(collapsedByGroupId)
        .filter(([, isCollapsed]) => isCollapsed)
        .map(([groupId]) => groupId),
    ),
  );
};

type GroupCollapseState = {
  collapsedByGroupId: Record<string, boolean>;
  isCollapsed: (groupId: string) => boolean;
  setCollapsed: (groupId: string, isCollapsed: boolean) => void;
  toggleCollapsed: (groupId: string) => void;
};

export const useGroupCollapseStore = create<GroupCollapseState>((set, get) => ({
  collapsedByGroupId: readCollapsedGroupIds(),
  isCollapsed: (groupId) => Boolean(get().collapsedByGroupId[groupId]),
  setCollapsed: (groupId, isCollapsed) =>
    set((state) => {
      const nextCollapsedByGroupId = {
        ...state.collapsedByGroupId,
        [groupId]: isCollapsed,
      };

      if (!isCollapsed) {
        delete nextCollapsedByGroupId[groupId];
      }

      writeCollapsedGroupIds(nextCollapsedByGroupId);

      return { collapsedByGroupId: nextCollapsedByGroupId };
    }),
  toggleCollapsed: (groupId) =>
    get().setCollapsed(groupId, !get().isCollapsed(groupId)),
}));
