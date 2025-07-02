import { TaskGroupList } from "./features/taskGroup/components/TaskGroupList";

function App() {
  return (
    <div className="flex flex-col items-center bg-blue-50  min-h-screen pb-20 ">
      <h1 className="text-4xl mt-8 mb-4">- Todo List -</h1>
      <TaskGroupList />
    </div>
  );
}

export default App;
