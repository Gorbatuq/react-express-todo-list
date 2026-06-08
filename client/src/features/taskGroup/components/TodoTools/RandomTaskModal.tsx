import { useMemo, useState } from "react";
import { FiShuffle } from "react-icons/fi";
import { useGroups } from "../../hooks/groups/useGroups";
import {
  type TaskWithGroup,
  useTasksByGroups,
} from "../../hooks/tasks/useTasksByGroups";
import { getRandomTask } from "./taskChoice";
import {
  TaskChoiceGroupSelect,
} from "./TaskChoiceGroupSelect";
import { TaskChoiceModalShell } from "./TaskChoiceModalShell";
import { TaskChoiceResult } from "./TaskChoiceResult";

type Props = {
  onClose: () => void;
};

export const RandomTaskModal = ({ onClose }: Props) => {
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [selectedTask, setSelectedTask] = useState<TaskWithGroup | null>(null);

  const { data: groups = [] } = useGroups();
  const visibleGroups = useMemo(() => {
    if (selectedGroupId === "all") return groups;
    return groups.filter((group) => group.id === selectedGroupId);
  }, [groups, selectedGroupId]);
  const { tasks, isLoading } = useTasksByGroups(visibleGroups, true);

  return (
    <TaskChoiceModalShell
      icon={<FiShuffle />}
      onClose={onClose}
      title="Random task"
    >
      <div className="space-y-6">
        <TaskChoiceGroupSelect
          groups={groups}
          value={selectedGroupId}
          onChange={(groupId) => {
            setSelectedGroupId(groupId);
            setSelectedTask(null);
          }}
        />

        <button
          type="button"
          onClick={() => setSelectedTask(getRandomTask(tasks))}
          disabled={isLoading || tasks.length === 0}
          className="app-action-button app-action-button-success w-full"
        >
          Pick random
        </button>

        <TaskChoiceResult
          isLoading={isLoading}
          selectedTask={selectedTask}
          tasksCount={tasks.length}
        />
      </div>
    </TaskChoiceModalShell>
  );
};
