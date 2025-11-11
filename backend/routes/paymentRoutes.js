import express from "express";
import {
  createSimulatedPayment,
  getPayments,
  getPaymentById,
  refundPayment
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/simulate", createSimulatedPayment);
router.get("/:shopId", getPayments);
router.get("/single/:id", getPaymentById);
router.put("/refund/:id", refundPayment);

export default router;