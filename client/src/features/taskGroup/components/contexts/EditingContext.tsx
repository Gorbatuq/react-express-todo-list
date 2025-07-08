/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import type {
  EditingGroup,
  EditingTask,
} from "../TaskGroupCard/TaskGroupCard.types";
import type { Dispatch, SetStateAction } from "react";

interface EditingContextType {
  editingGroup: EditingGroup | null;
  setEditingGroup: Dispatch<SetStateAction<EditingGroup | null>>;
  editingTask: EditingTask | null;
  setEditingTask: Dispatch<SetStateAction<EditingTask | null>>;
}

export const EditingContext = createContext<EditingContextType | undefined>(
  undefined
);

export const useEditingContext = () => {
  const ctx = useContext(EditingContext);
  if (!ctx)
    throw new Error("useEditingContext must be used within EditingProvider");
  return ctx;
};

export const EditingProvider = EditingContext.Provider;
