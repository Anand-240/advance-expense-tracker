import mongoose from "mongoose";

const dailySummarySchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  date: { type: String, required: true },
  totalRevenue: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  topPaymentMethod: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DailySummary", dailySummarySchema);