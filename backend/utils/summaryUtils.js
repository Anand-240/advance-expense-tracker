import Payment from "../models/Payment.js";
import Expense from "../models/Expense.js";

export const calculateDailySummary = async (shopId, date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const payments = await Payment.aggregate([
    { $match: { shopId, status: "paid", createdAt: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        totalSales: { $sum: 1 },
        topMethod: { $first: "$method" }
      }
    }
  ]);

  const expenses = await Expense.aggregate([
    { $match: { shopId, createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, totalExpenses: { $sum: "$amount" } } }
  ]);

  const rev = payments[0]?.totalRevenue || 0;
  const sales = payments[0]?.totalSales || 0;
  const exp = expenses[0]?.totalExpenses || 0;
  const profit = rev - exp;

  return {
    date: date.toISOString().split("T")[0],
    totalRevenue: rev,
    totalSales: sales,
    totalExpenses: exp,
    profit,
    topPaymentMethod: payments[0]?.topMethod || null
  };
};