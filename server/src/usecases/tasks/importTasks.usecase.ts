// import mongoose from "mongoose";
// import { AppError } from "../../errors/AppError";
// import { groupRepo } from "../../repositories/groupRepo";
// import { taskRepo } from "../../repositories/taskRepo";

// export async function importTasksUsecase(
//   userId: string,
//   body: {
//     tasks: Array<{
//       title: string;
//       groupId: string;
//       order: number;
//       completed?: boolean;
//     }>;
//   }
// ) {
//   const tasks = body.tasks ?? [];
//   if (tasks.length === 0) return { message: "Tasks imported" };

//   const session = await mongoose.startSession();
//   try {
//     await session.withTransaction(async () => {
//       const groups = await groupRepo.listByUser(userId, session);
//       const groupIds = new Set(groups.map((g) => g._id.toString()));

//       // ownership check
//       for (const t of tasks) {
//         if (!groupIds.has(t.groupId)) {
//           throw new AppError(
//             403,
//             "FOREIGN_GROUP",
//             "Import contains foreign groupId"
//           );
//         }
//       }

//       // normalize + basic safety
//       const prepared = tasks.map((t) => ({
//         title: String(t.title).trim(),
//         groupId: t.groupId,
//         order: Number.isFinite(t.order) ? Math.max(0, Math.trunc(t.order)) : 0,
//         completed: t.completed ?? false,
//         userId,
//       }));

//       await taskRepo.insertMany(prepared, session);
//     });

//     return { message: "Tasks imported" };
//   } finally {
//     session.endSession();
//   }
// }
