import { Header } from "./features/taskGroup/components/Header/Header";
import { TaskGroupList } from "./features/taskGroup/components/TaskGroupList";

function App() {
  return (
    <div
      className="flex flex-col min-h-screen bg-blue-50 
    dark:bg-gray-900 text-gray-900 dark:text-gray-100 "
    >
      <Header />
      <TaskGroupList />
    </div>
  );
}

export default App;
