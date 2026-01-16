import { DndContext, closestCenter } from "@dnd-kit/core";
import { AddGroupForm } from "./AddForms/AddGroupForm";
import { TaskGroupGrid } from "./TaskGroupGrid";
import { TaskGroupSkeletonGrid } from "./ui/TaskGroupSkeletonGrid";
import { useGroups } from "../hooks/queries/group/useGroups";
import { useMe } from "../../../hooks/auth/useMe";
import { useBoardDnd } from "../hooks/useBoardDnd";

export const TaskGroupList = () => {
  const { data: groups, isLoading } = useGroups();
  const { data: user } = useMe();
  const { sensors, onDragEnd } = useBoardDnd();

  const isGuestLimited = user?.role === "GUEST" && (groups?.length ?? 0) >= 3;
  if (isLoading) return <TaskGroupSkeletonGrid />;

  return (
    <div>
      <AddGroupForm isGuestLimited={isGuestLimited} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <TaskGroupGrid groups={groups ?? []} />
      </DndContext>
    </div>
  );
};
