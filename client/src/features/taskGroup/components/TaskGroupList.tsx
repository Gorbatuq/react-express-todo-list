// TaskGroupList.tsx
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { AddGroupForm } from "./AddForms/AddGroupForm";
import { TaskGroupGrid } from "./TaskGroupGrid";
import { TaskGroupSkeletonGrid } from "./ui/TaskGroupSkeletonGrid";
import { useGroups } from "../hooks/groups/useGroups";
import { useSortedGroups } from "../hooks/groups/useSortedGroups";
import { useHandleDragEnd } from "../hooks/useHandleDragEnd";
import { useMe } from "../../auth/hooks/useMe";
import type { GroupSortType } from "../../../types";
import { GroupSortMenu } from "./GroupSortMenu";

const taskGroupListContainerClass =
  "mx-auto flex w-full max-w-screen-2xl flex-col items-center px-4 sm:px-6 md:px-8";

export const TaskGroupList = () => {
  const [groupSort, setGroupSort] = useState<GroupSortType>("manual");
  const { data: groups, isLoading } = useGroups();
  const { data: user } = useMe();
  const handleDragEnd = useHandleDragEnd();
  const sortedGroups = useSortedGroups(groups ?? [], groupSort);

  const isGuestLimited = user?.role === "GUEST" && (groups?.length ?? 0) >= 3;
  const isGroupDragDisabled = groupSort !== "manual";

  if (isLoading) {
    return (
      <div className={taskGroupListContainerClass}>
        <TaskGroupSkeletonGrid />
      </div>
    );
  }

  return (
    <div className={taskGroupListContainerClass}>
      <div className="relative w-full">
        <div className="absolute right-0 top-6 z-30">
          <GroupSortMenu value={groupSort} onChange={setGroupSort} />
        </div>
        <AddGroupForm isGuestLimited={isGuestLimited} />
        <DragDropContext onDragEnd={handleDragEnd}>
          <TaskGroupGrid
            groups={sortedGroups}
            isGroupDragDisabled={isGroupDragDisabled}
          />
        </DragDropContext>
      </div>
    </div>
  );
};
