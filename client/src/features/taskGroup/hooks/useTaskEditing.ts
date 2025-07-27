import { useState } from "react";

interface UseTaskEditingProps {
  groupId: string;
  taskId: string;
  title: string;
  onSubmit: (title: string) => void;
}

export const useTaskEditing = ({
  title: initialTitle,
  onSubmit,
}: UseTaskEditingProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const startEditing = () => setEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== initialTitle.trim()) {
      onSubmit(trimmed); 
    }
    setEditing(false);
  };


  return {
    editing,
    title,
    setTitle,
    startEditing,
    handleChange,
    handleSubmit,
  };
};
