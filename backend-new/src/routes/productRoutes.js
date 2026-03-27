import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import auth from "../middlewares/auth.js";
import adminOnly from "../middlewares/admin.js";

const router = Router();

router.get("/", listProducts);
router.get("/list", listProducts);
router.get("/:id", getProduct);

router.post("/", auth, adminOnly, createProduct);
router.put("/:id", auth, adminOnly, updateProduct);
router.delete("/:id", auth, adminOnly, deleteProduct);

export default router;
