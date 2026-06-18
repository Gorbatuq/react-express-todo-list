import { useEffect } from "react";
import { useGroupCollapseStore } from "../store/groupCollapseStore";

const TASK_COLLAPSE_THRESHOLD = 6;

type UseTaskListCollapseParams = {
  groupId: string;
  isTasksLoaded: boolean;
  taskCount: number;
};

export const useTaskListCollapse = ({
  groupId,
  isTasksLoaded,
  taskCount,
}: UseTaskListCollapseParams) => {
  const canCollapse = taskCount > TASK_COLLAPSE_THRESHOLD;
  const isCollapsed = useGroupCollapseStore((state) =>
    Boolean(state.collapsedByGroupId[groupId]),
  );
  const setCollapsed = useGroupCollapseStore((state) => state.setCollapsed);
  const toggleCollapsed = useGroupCollapseStore(
    (state) => state.toggleCollapsed,
  );

  useEffect(() => {
    if (isTasksLoaded && !canCollapse) {
      setCollapsed(groupId, false);
    }
  }, [canCollapse, groupId, isTasksLoaded, setCollapsed]);

  return {
    canCollapse,
    isCollapsed,
    collapse: () => setCollapsed(groupId, true),
    expand: () => setCollapsed(groupId, false),
    toggle: () => toggleCollapsed(groupId),
  };
};
