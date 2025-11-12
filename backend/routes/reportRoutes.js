import express from "express";
import { getSummary, getTrends } from "../controllers/reportController.js";
const router = express.Router();
router.get("/summary/:shopId", getSummary);
router.get("/trends/:shopId", getTrends);
export default router;