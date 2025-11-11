import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  category: { type: String, enum: ["Rent", "Electricity", "Supplies", "Salary", "Other"], default: "Other" },
  amount: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Expense", expenseSchema);