import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["UPI", "Card", "Cash", "Other"], default: "UPI" },
  status: { type: String, enum: ["paid", "failed", "refunded"], default: "paid" },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", paymentSchema);