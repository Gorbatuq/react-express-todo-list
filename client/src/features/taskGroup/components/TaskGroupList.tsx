import { DragDropContext } from "@hello-pangea/dnd";
import { AddGroupForm } from "./AddTask/AddGroupForm";
import { TaskGroupGrid } from "./TaskGroupGrid";
import { TaskGroupSkeletonGrid } from "./ui/TaskGroupSkeletonGrid";
import { useGroups } from "../hooks/queries/group/useGroups";
import { useMe } from "../hooks/queries/auth/useMe";
import { useHandleDragEnd } from "../hooks/useHandleDragEnd";

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
    <div className="max-w-7xl mx-auto sm:px-6 md:px-8">
      <AddGroupForm isGuestLimited={isGuestLimited} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskGroupGrid groups={groups ?? []} />
      </DragDropContext>
    </div>
  );
};
