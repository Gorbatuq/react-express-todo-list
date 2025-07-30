import { Header } from "./features/taskGroup/components/Header/Header";
import { TaskGroupList } from "./features/taskGroup/components/TaskGroupList";

function App() {
  return (
    <div className="flex flex-col min-h-screen mb-12">
      <Header />
      <TaskGroupList />
    </div>
  );
}

export default App;
