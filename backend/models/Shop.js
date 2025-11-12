import mongoose from "mongoose";
const shopSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  name: { type: String, required: true },
  ownerName: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  qrCodeUrl: { type: String },
  totalRevenue: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Shop", shopSchema);