import { Router } from "express";
import {
  addToCart,
  getCart,
  getUserCartLegacy,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cartController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/add", auth, addToCart);
router.get("/get", auth, getCart);
router.get("/getUserCart", auth, getUserCartLegacy);
router.put("/update", auth, updateCartItem);
router.post("/remove", auth, removeCartItem);
router.post("/clear", auth, clearCart);

export default router;
