import { useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";

import { AddGroupForm } from "./AddTask/AddGroupForm";
import { TaskGroupGrid } from "./TaskGroupGrid";
import { TaskGroupSkeletonGrid } from "./ui/TaskGroupSkeletonGrid";

import { handleDragEnd } from "@/store/dndStore";
import { useGroupStore } from "@/store/groupStore";
import { useAuthStore } from "@/store/authStore";

export const TaskGroupList = () => {
  const reload = useGroupStore((s) => s.reload);
  const loading = useGroupStore((s) => s.loading);
  const hasLoaded = useGroupStore((s) => s.hasLoaded);

  const { user, loading: authLoading } = useAuthStore();
  const shouldLoad = !!user && !hasLoaded;

  useEffect(() => {
    if (shouldLoad) {
      reload().catch(console.error);
    }
  }, [shouldLoad, reload]);

  if (authLoading || (!hasLoaded && loading)) {
    return <TaskGroupSkeletonGrid />;
  }

  return (
    <div className="max-w-7xl mx-auto sm:px-6 md:px-8">
      <AddGroupForm />
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskGroupGrid />
      </DragDropContext>
    </div>
  );
};
