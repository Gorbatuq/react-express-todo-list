import { useState } from "react";

export const useTaskEditing = ({
  groupId,
  taskId,
  title: initialTitle,
  onSubmit,
}: {
  groupId: string;
  taskId: string;
  title: string;
  onSubmit: (groupId: string, taskId: string, title: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const startEditing = () => setEditing(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleSubmit = () => {
    onSubmit(groupId, taskId, title);
    setEditing(false);
  };

  return {
    editing,
    title,
    startEditing,
    handleChange,
    handleSubmit,
  };
};