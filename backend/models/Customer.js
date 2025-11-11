import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  totalSpent: { type: Number, default: 0 },
  totalVisits: { type: Number, default: 0 },
  lastPurchaseAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Customer", customerSchema);