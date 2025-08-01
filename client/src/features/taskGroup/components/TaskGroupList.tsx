import { useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";

import { AddGroupForm } from "./AddTask/AddGroupForm";
import { TaskGroupGrid } from "./TaskGroupGrid";
import { handleDragEnd } from "@/store/dndStore";
import { useGroupStore } from "@/store/groupStore";
import { TaskGroupSkeletonGrid } from "./ui/TaskGroupSkeletonGrid";

export const TaskGroupList = () => {
  const reload = useGroupStore((s) => s.reload);
  const loading = useGroupStore((s) => s.loading);
  const hasLoaded = useGroupStore((s) => s.hasLoaded);

  useEffect(() => {
    const init = async () => {
      try {
        await reload();
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, [reload]);

  if (loading && !hasLoaded) return <TaskGroupSkeletonGrid />;

  return (
    <div className="sm:px-6 md:px-8 max-w-7xl mx-auto">
      <AddGroupForm />
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskGroupGrid />
      </DragDropContext>
    </div>
  );
};
