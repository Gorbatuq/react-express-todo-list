import { TaskGroupList } from "./features/taskGroup/components/TaskGroupList";
import { ThemeToggleButton } from "./features/taskGroup/components/ThemeToggleButton";

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen pb-20 bg-blue-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <ThemeToggleButton />
      <h1 className="text-4xl mb-5">- Todo List -</h1>
      <TaskGroupList />
    </div>
  );
}

export default App;
