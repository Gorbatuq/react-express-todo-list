import { useState } from "react";

import { MdFormatListBulletedAdd } from "react-icons/md";
import { useGroupStore } from "@/store/groupStore";

interface Props {
  onCreate: () => void;
}

export const AddGroupForm = ({ onCreate }: Props) => {
  const createGroup = useGroupStore((s) => s.createGroup);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      await createGroup(trimmed);
      setTitle("");
      onCreate();
    } catch (err) {
      console.error("Create group failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center gap-2 mb-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Group title"
        className="border rounded-lg px-4 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-slate-400 text-white hover:bg-slate-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Add group"
      >
        <MdFormatListBulletedAdd />
      </button>
    </form>
  );
};
