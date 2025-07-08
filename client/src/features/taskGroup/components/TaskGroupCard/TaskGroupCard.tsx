import { Draggable } from "@hello-pangea/dnd";
import { AddTaskInput } from "../AddTaskInput";
import { useTaskGroupCard } from "./useTaskGroupCard";
import { GroupHeader } from "./GroupHeader";
import { TaskList } from "./TaskList";
import { FilterButtons } from "./FilterButtons";
import { useGroupsContext } from "../contexts/GroupsContext";
import { useEditingContext } from "../contexts/EditingContext";
import type { TaskGroup } from "../../model/types";
import { useReducer } from "react";
import React from "react";

interface LocalState {
  title: string;
  filter: "all" | "completed" | "active";
}

type Action =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_FILTER"; payload: LocalState["filter"] };

const reducer = (state: LocalState, action: Action): LocalState => {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

export const TaskGroupCard = React.memo(
  ({ group, index }: { group: TaskGroup; index: number }) => {
    const { handlers } = useGroupsContext();
    const { editingGroup, setEditingGroup, editingTask, setEditingTask } =
      useEditingContext();

    const [local, dispatch] = useReducer(reducer, {
      title: "",
      filter: "all",
    });

    const {
      isEditingGroup,
      filteredTasks,
      handleGroupEditSubmit,
      handleDeleteGroup,
    } = useTaskGroupCard({
      group,
      filter: { [group._id]: local.filter },
      editingGroup,
      handlers,
      setEditingGroup,
    });

    const handleAdd = async (groupId: string, title: string) => {
      await handlers.addTaskToGroup(groupId, title);
    };

    return (
      <Draggable draggableId={group._id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="flex flex-col rounded-2xl bg-white dark:bg-zinc-700 
              shadow-lg p-4 transition-transform hover:scale-[1.02]"
          >
            <div {...provided.dragHandleProps}>
              <GroupHeader
                groupId={group._id}
                title={group.title}
                isEditing={isEditingGroup}
                editingGroup={editingGroup}
                setEditingGroup={setEditingGroup}
                handleGroupEditSubmit={handleGroupEditSubmit}
                handleDeleteGroup={handleDeleteGroup}
              />
            </div>

            <TaskList
              groupId={group._id}
              tasks={filteredTasks}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              handlers={handlers}
            />

            <AddTaskInput
              groupId={group._id}
              value={local.title}
              onChange={(val) => dispatch({ type: "SET_TITLE", payload: val })}
              onAdd={handleAdd}
              reload={handlers.reload ?? (() => {})}
            />

            <FilterButtons
              onChange={(type) =>
                dispatch({ type: "SET_FILTER", payload: type })
              }
              currentFilter={local.filter}
            />
          </div>
        )}
      </Draggable>
    );
  }
);
