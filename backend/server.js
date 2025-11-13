import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./sockets/socketServer.js";
import { startJobs } from "./jobs/index.js";
dotenv.config();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
initSocket(server);
const start = async () => {
  try {
    await connectDB();
    if (process.env.AUTO_CREATE_DEMO === "true") {
      const Shop = (await import("./models/Shop.js")).default;
      const Payment = (await import("./models/Payment.js")).default;
      const demoName = "demo";
      let shop = await Shop.findOne({ name: demoName });
      if (!shop) {
        shop = await Shop.create({
          name: demoName,
          ownerName: "Demo Owner",
          email: "demo@local",
          phone: "0000000000",
          address: "Demo Address",
          totalRevenue: 0,
          totalSales: 0
        });
      }
      const existing = await Payment.findOne({ shopId: shop._id });
      if (!existing) {
        const samples = [
          { shopId: shop._id, customerName: "Alice", amount: 120, method: "UPI", status: "paid" },
          { shopId: shop._id, customerName: "Bob", amount: 250, method: "Card", status: "paid" },
          { shopId: shop._id, customerName: "Charlie", amount: 60, method: "Cash", status: "paid" }
        ];
        for (const s of samples) {
          await Payment.create(s);
          await Shop.updateOne({ _id: shop._id }, { $inc: { totalRevenue: s.amount, totalSales: 1 } });
        }
      }
    }
    startJobs();
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
const gracefulShutdown = async () => {
  try {
    console.log("Shutting down...");
    server.close(() => {});
    await mongoose.connection.close(false);
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
start();