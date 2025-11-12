import cron from "node-cron";
import DailySummary from "../models/DailySummary.js";
import Shop from "../models/Shop.js";
import { calculateDailySummary } from "../utils/summaryUtils.js";

export const scheduleDailySummary = () => {
  cron.schedule("5 0 * * *", async () => {
    try {
      const shops = await Shop.find({});
      const today = new Date();
      for (const s of shops) {
        const summary = await calculateDailySummary(s._id, today);
        await DailySummary.updateOne(
          { shopId: s._id, date: summary.date },
          { $set: summary },
          { upsert: true }
        );
      }
      console.log("dailySummary: completed for", shops.length, "shops");
    } catch (err) {
      console.error("dailySummary: error", err);
    }
  }, { timezone: process.env.TIMEZONE || "UTC" });
};