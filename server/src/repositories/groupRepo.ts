import { TaskGroup } from "../models/TaskGroup";
import mongoose from "mongoose";

export const groupRepo = {
  listByUser(userId: string, session?: mongoose.ClientSession) {
    const q = TaskGroup.find({ userId }).sort({ order: 1 }).lean();
    return session ? q.session(session) : q;
  },

  countByUser(userId: string, session?: mongoose.ClientSession) {
    const q = TaskGroup.countDocuments({ userId });
    return session ? q.session(session) : q;
  },

  findByIdForUser(
    groupId: string,
    userId: string,
    session?: mongoose.ClientSession
  ) {
    const q = TaskGroup.findOne({ _id: groupId, userId });
    return session ? q.session(session) : q;
  },

  deleteByIdForUser(
    groupId: string,
    userId: string,
    session?: mongoose.ClientSession
  ) {
    const q = TaskGroup.findOneAndDelete({ _id: groupId, userId });
    return session ? q.session(session) : q;
  },

  async bulkSetOrder(
    userId: string,
    idsInOrder: string[],
    session?: mongoose.ClientSession
  ) {
    const phase1 = idsInOrder.map((id, idx) => ({
      updateOne: {
        filter: { _id: id, userId },
        update: { $set: { order: -(idx + 1) } },
      },
    }));

    const phase2 = idsInOrder.map((id, idx) => ({
      updateOne: {
        filter: { _id: id, userId },
        update: { $set: { order: idx } },
      },
    }));

    await TaskGroup.bulkWrite(phase1, { session, ordered: true });
    await TaskGroup.bulkWrite(phase2, { session, ordered: true });
  },
};
