import { useMemo, useState } from "react";
import { FiClock } from "react-icons/fi";
import { Wheel } from "react-custom-roulette-r19";
import { useGroups } from "../../hooks/groups/useGroups";
import {
  type TaskWithGroup,
  useTasksByGroups,
} from "../../hooks/tasks/useTasksByGroups";
import {
  getTaskLabel,
  getWheelSpinCoefficient,
  SPIN_DURATION_OPTIONS,
  WHEEL_BORDER_COLOR,
  WHEEL_COLORS,
  WHEEL_TEXT_COLOR,
} from "./taskChoice";
import { TaskChoiceGroupSelect } from "./TaskChoiceGroupSelect";
import { TaskChoiceModalShell } from "./TaskChoiceModalShell";
import { TaskChoiceResult } from "./TaskChoiceResult";

type Props = {
  onClose: () => void;
};

export const TaskWheelModal = ({ onClose }: Props) => {
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [selectedTask, setSelectedTask] = useState<TaskWithGroup | null>(null);
  const [spinDuration, setSpinDuration] = useState(3);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const { data: groups = [] } = useGroups();
  const visibleGroups = useMemo(() => {
    if (selectedGroupId === "all") return groups;
    return groups.filter((group) => group.id === selectedGroupId);
  }, [groups, selectedGroupId]);
  const { tasks, isLoading } = useTasksByGroups(visibleGroups, true);
  const wheelData = useMemo(
    () =>
      (tasks.length > 0 ? tasks : [{ id: "empty", title: "No tasks" }]).map(
        (task, index) => ({
          option: getTaskLabel(task.title),
          style: {
            backgroundColor: WHEEL_COLORS[index % WHEEL_COLORS.length],
            textColor: WHEEL_TEXT_COLOR,
            fontSize: 12,
            fontWeight: 300,
          },
        }),
      ),
    [tasks],
  );

  const spinWheel = () => {
    if (tasks.length === 0 || isSpinning) return;

    const nextTaskIndex = Math.floor(Math.random() * tasks.length);
    setPrizeNumber(nextTaskIndex);
    setIsSpinning(true);
    setSelectedTask(null);
  };

  return (
    <TaskChoiceModalShell
      icon={<FiClock />}
      maxWidth="max-w-5xl"
      onClose={onClose}
      title="Task wheel"
    >
      <div className="grid gap-5 sm:grid-cols-2 sm:items-center">
        <div className="order-2 max-w-full overflow-visible sm:order-1">
          <div className="task-wheel-frame">
            <Wheel
              mustStartSpinning={isSpinning}
              prizeNumber={prizeNumber}
              data={wheelData}
              backgroundColors={WHEEL_COLORS}
              textColors={[WHEEL_TEXT_COLOR]}
              outerBorderColor={WHEEL_BORDER_COLOR}
              outerBorderWidth={2}
              innerRadius={10}
              innerBorderColor={WHEEL_BORDER_COLOR}
              innerBorderWidth={2}
              radiusLineColor={WHEEL_BORDER_COLOR}
              radiusLineWidth={2}
              fontSize={14}
              fontWeight={400}
              perpendicularText={false}
              textDistance={62}
              spinDuration={getWheelSpinCoefficient(spinDuration)}
              disableInitialAnimation
              onStopSpinning={() => {
                setSelectedTask(tasks[prizeNumber] ?? null);
                setIsSpinning(false);
              }}
            />
          </div>
        </div>

        <div className="order-1 space-y-4 self-start sm:order-2">
          <TaskChoiceGroupSelect
            groups={groups}
            value={selectedGroupId}
            disabled={isSpinning}
            onChange={(groupId) => {
              setSelectedGroupId(groupId);
              setSelectedTask(null);
            }}
          />

          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Spin time
            <select
              value={spinDuration}
              onChange={(event) => setSpinDuration(Number(event.target.value))}
              disabled={isSpinning}
              className="app-input mt-1 w-full"
            >
              {SPIN_DURATION_OPTIONS.map((seconds) => (
                <option key={seconds} value={seconds}>
                  {seconds} seconds
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={spinWheel}
            disabled={isLoading || tasks.length === 0 || isSpinning}
            className="app-action-button app-action-button-success w-full"
          >
            {isSpinning ? "Spinning..." : "Spin"}
          </button>

          <TaskChoiceResult
            isLoading={isLoading}
            selectedTask={selectedTask}
            tasksCount={tasks.length}
          />
        </div>
      </div>
    </TaskChoiceModalShell>
  );
};
