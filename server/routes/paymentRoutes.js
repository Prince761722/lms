import express from "express";
import {
  getRozorpayApiKey,
  buySubscription,
  verifySubscription,
  unsubscribe,
  allPayment
} from "../controllers/paymentController.js";

import { isLoggedIn, authorizedRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

//  USER ONLY
router.get("/razorpay-key", isLoggedIn, getRozorpayApiKey);

router.post(
  "/subscribe",
  isLoggedIn,
  authorizedRoles("user"), //  ONLY USER CAN SUBSCRIBE
  buySubscription
);

router.post(
  "/verify",
  isLoggedIn,
  authorizedRoles("user"), //  ONLY USER CAN VERIFY
  verifySubscription
);

router.post(
  "/unsubscribe",
  isLoggedIn,
  authorizedRoles("user"),
  unsubscribe
);

//  ADMIN ONLY
router.get(
  "/all",
  isLoggedIn,
  authorizedRoles("admin"),
  allPayment
);

export default router;