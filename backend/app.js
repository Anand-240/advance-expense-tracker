import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

import shopRoutes from "./routes/shopRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use("/api/shops", shopRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend server is running...");
});

export default app;