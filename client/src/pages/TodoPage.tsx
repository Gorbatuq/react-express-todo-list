import { TaskGroupList } from "../features/taskGroup/components/TaskGroupList";
import { BulkTaskImportButton } from "../features/taskGroup/components/BulkTaskImport/BulkTaskImportButton";
import { Header } from "../shared/layout/Header/Header";
import { Main } from "../shared/layout/Main/Main";

export const TodoPage = () => {
  return (
    <div className="flex flex-col mb-12">
      <Header actions={<BulkTaskImportButton />} />
      <Main>
        <TaskGroupList />
      </Main>
    </div>
  );
};
