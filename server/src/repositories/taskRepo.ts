import mongoose, { Types } from "mongoose";
import { Task, type TaskDocument } from "../models/Task";

type Session = mongoose.ClientSession;

type CreateTaskInput = {
  title: string;
  completed: boolean;
  order: number;
  groupId: string;
  userId: string;
};

type OrderRange = { gt?: number; gte?: number; lt?: number; lte?: number };

type LeanOrderDoc = { _id: Types.ObjectId; order: number };

function withSession<T extends mongoose.Query<any, any>>(
  q: T,
  session?: Session
) {
  return session ? q.session(session) : q;
}

/**
 * IMPORTANT:
 * With unique index (userId, groupId, order), ANY multi-doc order shifts must avoid updateMany($inc),
 * because intermediate duplicates can happen => E11000.
 * We do bulkWrite in safe order:
 *  - delta +1 => update DESC by order
 *  - delta -1 => update ASC by order
 */
async function shiftOrdersSafe(params: {
  userId: string;
  groupId: string;
  filter: Record<string, unknown>;
  delta: 1 | -1;
  session?: Session;
}) {
  const { userId, groupId, filter, delta, session } = params;

  const sort = delta === 1 ? { order: -1 as const } : { order: 1 as const };

  const q = Task.find({ userId, groupId, ...filter }, { _id: 1, order: 1 })
    .sort(sort)
    .lean<LeanOrderDoc[]>();

  const docs = await withSession(q, session);
  if (docs.length === 0) return;

  const ops = docs.map((d) => ({
    updateOne: {
      filter: { _id: d._id, userId, groupId },
      update: { $set: { order: d.order + delta } },
    },
  }));

  await Task.bulkWrite(ops, { session, ordered: true });
}

export const taskRepo = {
  // ---------- Reads ----------
  listByGroup(userId: string, groupId: string, session?: Session) {
    const q = Task.find({ userId, groupId }).sort({ order: 1 }).lean();
    return withSession(q, session);
  },

  countByGroup(userId: string, groupId: string, session?: Session) {
    const q = Task.countDocuments({ userId, groupId });
    return withSession(q, session);
  },

  findByIdForUser(taskId: string, userId: string, session?: Session) {
    const q = Task.findOne({ _id: taskId, userId });
    return withSession(q, session);
  },

  // ---------- Deletes ----------
  deleteByIdForUser(taskId: string, userId: string, session?: Session) {
    const q = Task.findOneAndDelete({ _id: taskId, userId });
    return withSession(q, session);
  },

  deleteByGroup(groupId: string, userId: string, session?: Session) {
    const q = Task.deleteMany({ groupId, userId });
    return withSession(q, session);
  },

  // ---------- Order operations (SAFE) ----------
  /**
   * After removing a task at `fromExclusive`, decrement orders of tasks with order > fromExclusive.
   * Safe because delta=-1 and we update ASC.
   */
  async shiftOrdersDown(
    userId: string,
    groupId: string,
    fromExclusive: number,
    session?: Session
  ) {
    await shiftOrdersSafe({
      userId,
      groupId,
      filter: { order: { $gt: fromExclusive } },
      delta: -1,
      session,
    });
  },

  /**
   * Before inserting a task at `fromInclusive`, increment orders of tasks with order >= fromInclusive.
   * Safe because delta=+1 and we update DESC.
   */
  async shiftOrdersUpFrom(
    userId: string,
    groupId: string,
    fromInclusive: number,
    session?: Session
  ) {
    await shiftOrdersSafe({
      userId,
      groupId,
      filter: { order: { $gte: fromInclusive } },
      delta: 1,
      session,
    });
  },

  /**
   * Reorder within the same group by shifting a range.
   * delta=+1 => update DESC, delta=-1 => update ASC.
   */
  async shiftOrdersInRange(
    userId: string,
    groupId: string,
    range: OrderRange,
    delta: 1 | -1,
    session?: Session
  ) {
    await shiftOrdersSafe({
      userId,
      groupId,
      filter: { order: range },
      delta,
      session,
    });
  },

  /**
   * Two-phase reorder: temporary negative orders, then final orders.
   * This is robust under unique index (userId, groupId, order).
   */
  async bulkSetOrder(
    userId: string,
    groupId: string,
    idsInOrder: string[],
    session?: Session
  ) {
    const phase1 = idsInOrder.map((id, idx) => ({
      updateOne: {
        filter: { _id: id, userId, groupId },
        update: { $set: { order: -(idx + 1) } },
      },
    }));

    const phase2 = idsInOrder.map((id, idx) => ({
      updateOne: {
        filter: { _id: id, userId, groupId },
        update: { $set: { order: idx } },
      },
    }));

    await Task.bulkWrite(phase1, { session, ordered: true });
    await Task.bulkWrite(phase2, { session, ordered: true });
  },

  // ---------- Creates ----------
  insertMany(docs: CreateTaskInput[], session?: Session) {
    return Task.insertMany(docs, { session });
  },

  async createOne(
    doc: CreateTaskInput,
    session?: Session
  ): Promise<TaskDocument> {
    const [created] = await Task.create([doc], { session });
    return created;
  },
};
