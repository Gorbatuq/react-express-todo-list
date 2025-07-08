/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { TaskGroup } from "../../model/types";
import type { Handlers } from "../TaskGroupCard/TaskGroupCard.types";

interface GroupsContextType {
  groups: TaskGroup[];
  setGroups: Dispatch<SetStateAction<TaskGroup[]>>;
  handlers: Handlers;
}

export const GroupsContext = createContext<GroupsContextType | undefined>(
  undefined
);

export const useGroupsContext = () => {
  const ctx = useContext(GroupsContext);
  if (!ctx)
    throw new Error("useGroupsContext must be used within GroupsProvider");
  return ctx;
};

export const GroupsProvider = GroupsContext.Provider;
