import Expense from "../models/Expense.js";
import { io } from "../sockets/socketServer.js";

export const createExpense = async (req, res) => {
  const { shopId, category = "Other", amount, description } = req.body;
  if (!shopId || !amount) return res.status(400).json({ error: "shopId and amount required" });
  const exp = await Expense.create({ shopId, category, amount, description, createdAt: new Date() });
  io.to(String(shopId)).emit("expense:new", { expenseId: exp._id, amount: exp.amount, category: exp.category });
  res.json(exp);
};

export const getExpenses = async (req, res) => {
  const { shopId } = req.params;
  const { page = 1, limit = 50, from, to, category } = req.query;
  const q = { shopId };
  if (category) q.category = category;
  if (from || to) {
    q.createdAt = {};
    if (from) q.createdAt.$gte = new Date(from);
    if (to) q.createdAt.$lte = new Date(to);
  }
  const data = await Expense.find(q)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  const total = await Expense.countDocuments(q);
  res.json({ data, total, page: Number(page), limit: Number(limit) });
};