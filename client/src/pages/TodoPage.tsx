import { TaskGroupList } from "../features/taskGroup/components/TaskGroupList";
import { BulkTaskImportButton } from "../features/taskGroup/components/BulkTaskImport/BulkTaskImportButton";
import { TodoToolsFooter } from "../features/taskGroup/components/TodoTools/TodoToolsFooter";
import { Header } from "../shared/layout/Header/Header";
import { Main } from "../shared/layout/Main/Main";

export const TodoPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header actions={<BulkTaskImportButton />} />
      <Main>
        <TaskGroupList />
      </Main>
      <TodoToolsFooter />
    </div>
  );
};
