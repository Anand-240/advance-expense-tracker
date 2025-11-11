import express from "express";
import {
  createShop,
  getShop,
  updateShop,
  getShopSummary
} from "../controllers/shopController.js";

const router = express.Router();

router.post("/", createShop);
router.get("/:id", getShop);
router.put("/:id", updateShop);
router.get("/summary/:id", getShopSummary);

export default router;