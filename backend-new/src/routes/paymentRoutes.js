import { Router } from "express";
import {
  verifyPayment,
  stripeCreate,
  stripeVerify,
  razorpayCreate,
  razorpayVerify
} from "../controllers/paymentController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/verify", auth, verifyPayment);
router.post("/stripe/create", auth, stripeCreate);
router.post("/stripe/verify", auth, stripeVerify);
router.post("/razorpay/create", auth, razorpayCreate);
router.post("/razorpay/verify", auth, razorpayVerify);

export default router;
