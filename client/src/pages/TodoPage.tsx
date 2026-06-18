import { TaskGroupList } from "../features/taskGroup/components/TaskGroupList";
import { BulkTaskImportButton } from "../features/taskGroup/components/BulkTaskImport/BulkTaskImportButton";
import { TodoToolsFooter } from "../features/taskGroup/components/TodoTools/TodoToolsFooter";
import { Header } from "../shared/layout/Header/Header";

export const TodoPage = () => {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-white dark:bg-transparent">
      <Header actions={<BulkTaskImportButton />} />
      <main className="w-full min-w-0 flex-1">
        <TaskGroupList />
      </main>
      <TodoToolsFooter />
    </div>
  );
};
