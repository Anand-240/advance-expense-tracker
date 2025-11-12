import Payment from "../models/Payment.js";
import Expense from "../models/Expense.js";
export const getSummary = async (req, res) => {
  const { shopId } = req.params;
  const { from, to } = req.query;
  const pm = { shopId, status: "paid" };
  if (from || to) {
    pm.createdAt = {};
    if (from) pm.createdAt.$gte = new Date(from);
    if (to) pm.createdAt.$lte = new Date(to);
  }
  const em = { shopId };
  if (from || to) {
    em.createdAt = {};
    if (from) em.createdAt.$gte = new Date(from);
    if (to) em.createdAt.$lte = new Date(to);
  }
  const salesAgg = await Payment.aggregate([{ $match: pm }, { $group: { _id: null, revenue: { $sum: "$amount" }, sales: { $sum: 1 } } }]);
  const methodAgg = await Payment.aggregate([{ $match: pm }, { $group: { _id: "$method", total: { $sum: "$amount" }, count: { $sum: 1 } } }, { $sort: { total: -1 } }]);
  const expAgg = await Expense.aggregate([{ $match: em }, { $group: { _id: "$category", total: { $sum: "$amount" } } }]);
  const revenue = salesAgg[0]?.revenue || 0;
  const sales = salesAgg[0]?.sales || 0;
  const avgOrder = sales ? +(revenue / sales).toFixed(2) : 0;
  const expenses = expAgg.reduce((a, b) => a + b.total, 0);
  const profit = +(revenue - expenses).toFixed(2);
  res.json({
    kpis: { revenue, sales, avgOrder, expenses, profit },
    methodSplit: methodAgg.map(m => ({ method: m._id, total: m.total, count: m.count })),
    expenseSplit: expAgg.map(e => ({ category: e._id, total: e.total }))
  });
};
export const getTrends = async (req, res) => {
  const { shopId } = req.params;
  const { gran = "day", from, to } = req.query;
  const fmt = gran === "hour" ? "%Y-%m-%d %H:00" : "%Y-%m-%d";
  const match = { shopId, status: "paid" };
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }
  const series = await Payment.aggregate([{ $match: match }, { $group: { _id: { $dateToString: { format: fmt, date: "$createdAt" } }, revenue: { $sum: "$amount" }, sales: { $sum: 1 } } }, { $sort: { "_id": 1 } }]);
  res.json(series.map(s => ({ time: s._id, revenue: s.revenue, sales: s.sales })));
};