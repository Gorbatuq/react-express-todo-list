import type {
  DraggableStateSnapshot,
  DraggableStyle,
} from "@hello-pangea/dnd";

export const getDropAnimationStyle = (
  style: DraggableStyle | undefined,
  snapshot: DraggableStateSnapshot,
) => {
  if (!snapshot.isDropAnimating) return style;

  return {
    ...style,
    transitionDuration: "0.001s",
  };
};
