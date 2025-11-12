import Payment from "../models/Payment.js";
import Shop from "../models/Shop.js";
import Customer from "../models/Customer.js";
import { io } from "../sockets/socketServer.js";
export const createSimulatedPayment = async (req, res) => {
  const { shopId, amount, method = "UPI", customerName, customerPhone, note } = req.body;
  if (!shopId || !amount) return res.status(400).json({ error: "shopId and amount required" });
  const payment = await Payment.create({ shopId, amount, method, status: "paid", customerName, customerPhone, note, createdAt: new Date() });
  await Shop.updateOne({ _id: shopId }, { $inc: { totalRevenue: amount, totalSales: 1 } });
  if (io) io.to(String(shopId)).emit("payment:new", { _id: payment._id, amount: payment.amount, method: payment.method, status: payment.status, createdAt: payment.createdAt });
  res.json(payment);
};
export const getPayments = async (req, res) => {
  const { shopId } = req.params;
  const { page = 1, limit = 50, from, to, status, method } = req.query;
  const q = { shopId };
  if (status) q.status = status;
  if (method) q.method = method;
  if (from || to) {
    q.createdAt = {};
    if (from) q.createdAt.$gte = new Date(from);
    if (to) q.createdAt.$lte = new Date(to);
  }
  const docs = await Payment.find(q).sort({ createdAt: -1 }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
  const total = await Payment.countDocuments(q);
  res.json({ data: docs, total, page: Number(page), limit: Number(limit) });
};
export const getPaymentById = async (req, res) => {
  const doc = await Payment.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
};
export const refundPayment = async (req, res) => {
  const { id } = req.params;
  const pay = await Payment.findById(id);
  if (!pay) return res.status(404).json({ error: "Not found" });
  if (pay.status === "refunded") return res.json(pay);
  pay.status = "refunded";
  await pay.save();
  await Shop.updateOne({ _id: pay.shopId }, { $inc: { totalRevenue: -pay.amount, totalSales: -1 } });
  if (io) io.to(String(pay.shopId)).emit("payment:update", { paymentId: pay._id, status: "refunded" });
  res.json(pay);
};