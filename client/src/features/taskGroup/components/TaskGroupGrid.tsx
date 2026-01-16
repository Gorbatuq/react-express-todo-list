// TaskGroupGrid.tsx
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import type { TaskGroup } from "../../../types";
import { SortableGroup } from "./SortableGroup";
import { dndIds } from "../types/dndIds";

export const TaskGroupGrid = ({ groups }: { groups: TaskGroup[] }) => {
  if (groups.length === 0)
    return (
      <p className="text-gray-500 text-sm text-center">
        No groups. Create first group !
      </p>
    );

  return (
    <SortableContext
      items={groups.map((g) => dndIds.group(g.id))}
      strategy={rectSortingStrategy}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start max-w-full">
        {groups.map((g) => (
          <SortableGroup key={g.id} group={g} />
        ))}
      </div>
    </SortableContext>
  );
};
