import Shop from "../models/Shop.js";
import Payment from "../models/Payment.js";
import Expense from "../models/Expense.js";

export const createShop = async (req, res) => {
  const { name, ownerName, email, phone, address } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const shop = await Shop.create({ name, ownerName, email, phone, address });
  res.json(shop);
};

export const getShop = async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) return res.status(404).json({ error: "Not found" });
  res.json(shop);
};

export const updateShop = async (req, res) => {
  const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!shop) return res.status(404).json({ error: "Not found" });
  res.json(shop);
};

export const getShopSummary = async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.query;
  const match = { shopId: id, status: "paid" };
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }
  const salesAgg = await Payment.aggregate([
    { $match: match },
    { $group: { _id: null, revenue: { $sum: "$amount" }, sales: { $sum: 1 } } }
  ]);
  const expMatch = { shopId: id };
  if (from || to) {
    expMatch.createdAt = {};
    if (from) expMatch.createdAt.$gte = new Date(from);
    if (to) expMatch.createdAt.$lte = new Date(to);
  }
  const expAgg = await Expense.aggregate([
    { $match: expMatch },
    { $group: { _id: null, expenses: { $sum: "$amount" } } }
  ]);
  const revenue = salesAgg[0]?.revenue || 0;
  const sales = salesAgg[0]?.sales || 0;
  const expenses = expAgg[0]?.expenses || 0;
  const avgOrder = sales ? +(revenue / sales).toFixed(2) : 0;
  const profit = +(revenue - expenses).toFixed(2);
  res.json({ revenue, sales, avgOrder, expenses, profit });
};