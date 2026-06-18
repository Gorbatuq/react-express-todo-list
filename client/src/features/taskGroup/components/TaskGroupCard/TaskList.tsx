import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { TaskItem } from "../TaskItem/TaskItem";
import type { Task } from "../../../../types";

interface Props {
  groupId: string;
  tasks: Task[];
  isCollapsed?: boolean;
  onExpand?: () => void;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEditSubmit: (taskId: string, title: string) => void;
}

export const TaskList = React.memo(
  ({
    groupId,
    tasks,
    isCollapsed = false,
    onExpand,
    onToggle,
    onDelete,
    onEditSubmit,
  }: Props) => {
    const listClassName = isCollapsed
      ? "flex max-h-64 flex-col gap-2 overflow-hidden"
      : "flex flex-col gap-2";

    return (
      <Droppable droppableId={groupId} type="task">
        {(provided) => (
          <div className="relative mb-4">
            {isCollapsed && (
              <button
                type="button"
                aria-label="Expand task list"
                onClick={onExpand}
                className="absolute inset-0 z-10 rounded-xl"
              />
            )}

            {isCollapsed && (
              <div
                aria-hidden="true"
                className="task-list-collapse-fade pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 rounded-b-xl bg-gradient-to-b from-transparent via-slate-100/45 to-slate-500/30 backdrop-blur-sm dark:via-zinc-800/40 dark:to-black/35"
              />
            )}

            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={listClassName}
            >
              {tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEditSubmit={onEditSubmit}
                />
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    );
  },
);
