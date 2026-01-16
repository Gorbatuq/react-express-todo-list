// "use client";

// import React from "react";
// import { createPortal } from "react-dom";
// import { DragOverlay, defaultDropAnimation } from "@dnd-kit/core";
// import { CSS, type Transform } from "@dnd-kit/utilities";
// import { motion, useReducedMotion } from "framer-motion";
// import type { UniqueIdentifier } from "@dnd-kit/core";

// export type ActiveDrag =
//   | { type: "group"; id: UniqueIdentifier }
//   | { type: "task"; id: UniqueIdentifier; groupId: string }
//   | null;

// export const SPRING = {
//   type: "spring",
//   stiffness: 520,
//   damping: 40,
//   mass: 0.6,
// } as const;

// export const FADE_SPRING = {
//   type: "spring",
//   stiffness: 380,
//   damping: 32,
//   mass: 0.6,
// } as const;

// export function framerStyle(
//   transform: Transform | null,
//   isDragging: boolean
// ): React.CSSProperties {
//   return {
//     transform: CSS.Transform.toString(transform),
//     transition: isDragging ? undefined : undefined, // керує Framer (layout)
//     willChange: "transform",
//     touchAction: "none",
//   };
// }

// export function MotionDiv({
//   children,
//   className,
//   style,
//   isDragging = false,
// }: {
//   children: React.ReactNode;
//   className?: string;
//   style?: React.CSSProperties;
//   isDragging?: boolean;
// }) {
//   const reduce = useReducedMotion();
//   return (
//     <motion.div
//       layout
//       className={className}
//       style={style}
//       {...(!reduce && {
//         layoutTransition: SPRING,
//         initial: false,
//         animate: isDragging
//           ? { scale: 1.02, opacity: 0.8 }
//           : { scale: 1, opacity: 1 },
//         transition: SPRING,
//       })}
//     >
//       {children}
//     </motion.div>
//   );
// }

// export function MotionLi({
//   children,
//   className,
//   style,
//   isDragging = false,
// }: {
//   children: React.ReactNode;
//   className?: string;
//   style?: React.CSSProperties;
//   isDragging?: boolean;
// }) {
//   const reduce = useReducedMotion();
//   return (
//     <motion.li
//       layout
//       className={className}
//       style={style}
//       {...(!reduce && {
//         layoutTransition: SPRING,
//         initial: false,
//         animate: isDragging
//           ? { scale: 1.02, opacity: 0.7 }
//           : { scale: 1, opacity: 1 },
//         transition: SPRING,
//       })}
//     >
//       {children}
//     </motion.li>
//   );
// }

// export const dropAnim = (durationMs = 220) => ({
//   ...defaultDropAnimation,
//   duration: durationMs,
//   easing: "cubic-bezier(0.2, 0, 0, 1)",
// });

// function OverlayPortal({ children }: { children: React.ReactNode }) {
//   if (typeof document === "undefined") return null;
//   return createPortal(children, document.body);
// }

// export function Overlay({
//   active,
//   renderGroup,
//   renderTask,
// }: {
//   active: ActiveDrag;
//   renderGroup: (id: string) => React.ReactNode;
//   renderTask: (groupId: string, taskId: string) => React.ReactNode;
// }) {
//   const reduce = useReducedMotion();
//   return (
//     <OverlayPortal>
//       <DragOverlay dropAnimation={dropAnim(reduce ? 1 : 220)}>
//         {active?.type === "group" ? (
//           <motion.div
//             layout
//             initial={{ scale: 1.02, opacity: 0.9 }}
//             animate={{ scale: 1.02, opacity: 0.95 }}
//             exit={{ opacity: 0.9 }}
//             transition={FADE_SPRING}
//             className="pointer-events-none"
//             aria-hidden
//           >
//             {renderGroup(String(active.id))}
//           </motion.div>
//         ) : active?.type === "task" ? (
//           <motion.li
//             layout
//             initial={{ scale: 1.02, opacity: 0.9 }}
//             animate={{ scale: 1.02, opacity: 0.95 }}
//             exit={{ opacity: 0.9 }}
//             transition={FADE_SPRING}
//             className="pointer-events-none"
//             aria-hidden
//           >
//             {renderTask(active.groupId, String(active.id))}
//           </motion.li>
//         ) : null}
//       </DragOverlay>
//     </OverlayPortal>
//   );
// }
