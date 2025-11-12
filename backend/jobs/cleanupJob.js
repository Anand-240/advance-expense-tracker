import cron from "node-cron";
import fs from "fs";
import path from "path";

export const scheduleCleanup = () => {
  cron.schedule("0 3 * * *", async () => {
    try {
      const receiptsDir = path.join(process.cwd(), "public", "receipts");
      const files = await fs.promises.readdir(receiptsDir).catch(() => []);
      const now = Date.now();
      const maxAge = (Number(process.env.RECEIPT_MAX_DAYS) || 30) * 24 * 60 * 60 * 1000;
      for (const f of files) {
        const fp = path.join(receiptsDir, f);
        const stat = await fs.promises.stat(fp).catch(() => null);
        if (!stat || !stat.isFile()) continue;
        if (now - stat.mtimeMs > maxAge) {
          await fs.promises.unlink(fp).catch(() => null);
        }
      }
      console.log("cleanupJob: receipts cleanup done");
    } catch (err) {
      console.error("cleanupJob: error", err);
    }
  }, { timezone: process.env.TIMEZONE || "UTC" });
};