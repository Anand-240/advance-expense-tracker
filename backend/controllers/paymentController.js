import Payment from "../models/Payment.js";
import Shop from "../models/Shop.js";
import Customer from "../models/Customer.js";
import { io } from "../sockets/socketServer.js";
import mongoose from "mongoose";

const resolveShopObjectId = async (incoming) => {
  if (!incoming) return null;
  if (mongoose.Types.ObjectId.isValid(incoming)) {
    return incoming;
  }
  const shop = await Shop.findOne({ name: incoming });
  if (shop) return shop._id;
  return null;
};

export const createSimulatedPayment = async (req, res) => {
  try {
    const { shopId: rawShopId, amount, method = "UPI", customerName, customerPhone, note } = req.body;
    if (!rawShopId || !amount) return res.status(400).json({ error: "shopId and amount required" });
    const shopObjectId = await resolveShopObjectId(rawShopId);
    if (!shopObjectId) return res.status(404).json({ error: "shop not found" });
    const payment = await Payment.create({
      shopId: shopObjectId,
      amount,
      method,
      status: "paid",
      customerName,
      customerPhone,
      note,
      createdAt: new Date()
    });
    await Shop.updateOne({ _id: shopObjectId }, { $inc: { totalRevenue: amount, totalSales: 1 } });
    if (io) io.to(String(shopObjectId)).emit("payment:new", {
      _id: payment._id,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      createdAt: payment.createdAt
    });
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error", detail: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const rawShopId = req.params.shopId;
    const shopObjectId = await resolveShopObjectId(rawShopId);
    if (!shopObjectId) return res.status(404).json({ error: "shop not found" });
    const { page = 1, limit = 50, from, to, status, method } = req.query;
    const q = { shopId: shopObjectId };
    if (status) q.status = status;
    if (method) q.method = method;
    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to) q.createdAt.$lte = new Date(to);
    }
    const docs = await Payment.find(q)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Payment.countDocuments(q);
    res.json({ data: docs, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error", detail: err.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const doc = await Payment.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error", detail: err.message });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const pay = await Payment.findById(id);
    if (!pay) return res.status(404).json({ error: "Not found" });
    if (pay.status === "refunded") return res.json(pay);
    pay.status = "refunded";
    await pay.save();
    await Shop.updateOne({ _id: pay.shopId }, { $inc: { totalRevenue: -pay.amount, totalSales: -1 } });
    if (io) io.to(String(pay.shopId)).emit("payment:update", { paymentId: pay._id, status: "refunded" });
    res.json(pay);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error", detail: err.message });
  }
};