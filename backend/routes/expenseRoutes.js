import express from "express";
import {
  createExpense,
  getExpenses
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", createExpense);
router.get("/:shopId", getExpenses);

export default router;