import cron from "node-cron";
import { User } from "../models/User";

const DAYS = 31;
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export const deleteOldGuests = () => {
  cron.schedule("0 3 * * *", async () => {
    const threshold = new Date(Date.now() - DAYS * MILLISECONDS_IN_DAY);

    try {
      const result = await User.deleteMany({
        role: "GUEST",
        lastLogin: { $lt: threshold },
      });

      if (result.deletedCount > 0) {
        console.log(`🧹 Deleted ${result.deletedCount} guest users`);
      }
    } catch (err) {
      console.error("❌ Cron-error in clean GUEST:", err);
    }
  });
};
