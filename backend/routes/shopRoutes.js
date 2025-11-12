import express from "express";
import { createShop, getShop, updateShop, getShopSummary } from "../controllers/shopController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", authMiddleware, createShop);
router.get("/mine", authMiddleware, async (req, res) => {
  const Shop = (await import("../models/Shop.js")).default;
  const shops = await Shop.find({ ownerId: req.user._id });
  res.json(shops);
});
router.get("/:id", getShop);
router.put("/:id", authMiddleware, updateShop);
router.get("/summary/:id", getShopSummary);
export default router;