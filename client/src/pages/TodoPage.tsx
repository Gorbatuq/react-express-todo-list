import { Header } from "@/shared/layout/Header/Header";
import { TaskGroupList } from "@/features/taskGroup/components/TaskGroupList";
import { Main } from "@/shared/layout/Main/Main";

export const TodoPage = () => {
  return (
    <div className="flex flex-col mb-12">
      <Header />
      <Main>
        <TaskGroupList />
      </Main>
    </div>
  );
};
