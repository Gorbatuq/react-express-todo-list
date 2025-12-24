import { DragDropContext } from "@hello-pangea/dnd";
import { AddGroupForm } from "./AddForms/AddGroupForm";
import { TaskGroupGrid } from "./TaskGroupGrid";
import { TaskGroupSkeletonGrid } from "./ui/TaskGroupSkeletonGrid";
import { useGroups } from "../hooks/queries/group/useGroups";
import { useHandleDragEnd } from "../hooks/useHandleDragEnd";
import { useMe } from "../../../hooks/auth/useMe";

export const TaskGroupList = () => {
  const { data: groups, isLoading } = useGroups();
  const { data: user } = useMe();
  const handleDragEnd = useHandleDragEnd();

  const isGuestLimited: boolean =
    user?.role === "GUEST" && (groups?.length ?? 0) >= 3;

  if (isLoading) {
    return <TaskGroupSkeletonGrid />;
  }

  return (
    <div>
      <AddGroupForm isGuestLimited={isGuestLimited} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskGroupGrid groups={groups ?? []} />
      </DragDropContext>
    </div>
  );
};
