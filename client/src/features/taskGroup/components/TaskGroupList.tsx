import { useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";

import { AddGroupForm } from "./AddTask/AddGroupForm";
import { TaskGroupGrid } from "./TaskGroupGrid";
import { useGroupStore } from "@/store/groupStore";

import { handleDragEnd } from "@/store/dndStore";

export const TaskGroupList = () => {
  const { reload } = useGroupStore();

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

  // -- I'm thinking about loading, then I'll decide something.
  return (
    <div className="sm:px-6 md:px-8 max-w-7xl mx-auto">
      <AddGroupForm />
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskGroupGrid />
      </DragDropContext>
    </div>
  );
};
