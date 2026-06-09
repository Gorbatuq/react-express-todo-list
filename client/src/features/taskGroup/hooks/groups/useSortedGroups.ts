import { useMemo } from "react";
import type { GroupSortType, TaskGroup } from "../../../../types";

const dateValue = (value: string) => {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
};

export const useSortedGroups = (
  groups: TaskGroup[],
  sortType: GroupSortType,
) => {
  return useMemo(() => {
    const nextGroups = [...groups];

    if (sortType === "createdAt") {
      return nextGroups.sort(
        (a, b) => dateValue(b.createdAt) - dateValue(a.createdAt),
      );
    }

    if (sortType === "updatedAt") {
      return nextGroups.sort(
        (a, b) => dateValue(b.updatedAt) - dateValue(a.updatedAt),
      );
    }

    if (sortType === "priority") {
      return nextGroups.sort((a, b) => a.priority - b.priority);
    }

    return nextGroups.sort((a, b) => a.order - b.order);
  }, [groups, sortType]);
};
