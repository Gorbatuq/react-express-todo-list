import { useState, useCallback } from "react";
import { groupApi } from "../api/groups";
import { MdFormatListBulletedAdd } from "react-icons/md";

export const AddGroupForm = ({ onCreate }: { onCreate: () => void }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;

      try {
        setLoading(true);
        await groupApi.create(trimmed);
        setTitle("");
        onCreate();
        console.log(`Create group ${trimmed}`);
      } catch (err) {
        console.error("Failed to create group:", err);
      } finally {
        setLoading(false);
      }
    },
    [title, onCreate]
  );

  return (
    <form onSubmit={handleSubmit} className="flex justify-center gap-2 mb-6">
      <input
        value={title}
        onChange={handleChange}
        placeholder="Group title"
        className="border rounded-lg px-4 py-1 shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <button
        type="submit"
        aria-label="Add group"
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-slate-400 text-white 
          hover:bg-slate-700 transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MdFormatListBulletedAdd />
      </button>
    </form>
  );
};
