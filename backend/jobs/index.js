import { scheduleDailySummary } from "./dailySummaryJob.js";
import { scheduleCleanup } from "./cleanupJob.js";

export const startJobs = () => {
  scheduleDailySummary();
  scheduleCleanup();
  console.log("Jobs started");
};