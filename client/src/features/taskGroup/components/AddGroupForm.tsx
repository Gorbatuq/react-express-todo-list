import { useState } from "react";
import { groupApi } from "../api/groups";

export const AddGroupForm = ({ onCreate }: { onCreate: () => void }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    try {
      await groupApi.create(trimmed);
      setTitle("");
      onCreate();
      console.log(`Create group ${trimmed}`);
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center gap-2 mb-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Group title"
        className="border rounded-lg px-4 py-1 shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-green-100"
      />
      <button
        type="submit"
        className="border rounded-lg bg-slate-300 text-xs px-2"
      >
        Add
      </button>
    </form>
  );
};
