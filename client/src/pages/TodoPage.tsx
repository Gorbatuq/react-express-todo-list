import { Header } from "@/features/taskGroup/components/Header/Header";
import { TaskGroupList } from "@/features/taskGroup/components/TaskGroupList";
import { useTheme } from "@/store/themeStore";
import { useEffect } from "react";

export const TodoPage = () => {
  const { theme } = useTheme();

  // later move to hook //
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
  // later move to hook //

  return (
    <div className="flex flex-col mb-12">
      <Header />
      <TaskGroupList />
    </div>
  );
};
