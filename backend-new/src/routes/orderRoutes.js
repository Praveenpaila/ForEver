import { Router } from "express";
import {
  placeOrder,
  listUserOrders,
  listAllOrders,
  updateOrderStatus,
  markPaid
} from "../controllers/orderController.js";
import auth from "../middlewares/auth.js";
import adminOnly from "../middlewares/admin.js";

const router = Router();

router.post("/place", auth, placeOrder);
router.get("/user", auth, listUserOrders);
router.get("/userorders", auth, listUserOrders);
router.post("/paid", auth, markPaid);

router.get("/admin", auth, adminOnly, listAllOrders);
router.put("/:id/status", auth, adminOnly, updateOrderStatus);

export default router;
