import { Header } from "@/features/taskGroup/components/Header/Header";
import { TaskGroupList } from "@/features/taskGroup/components/TaskGroupList";

export const TodoPage = () => {
  return (
    <div className="flex flex-col mb-12">
      <Header />
      <TaskGroupList />
    </div>
  );
};
