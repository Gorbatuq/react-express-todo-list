import { useEffect, useState } from "react";
import type { TaskGroup } from "../../../types";
import { fetchGroups } from "../api/taskGroupApi";

export const useGroups = (withReload = false) => {
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (err) {
      console.error("Failed to load groups", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return withReload ? { groups, loading, reload: load, setGroups  } : { groups, loading, setGroups };
};
