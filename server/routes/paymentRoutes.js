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

// ✅ FIXED — added "creator" to all user payment routes
router.get("/razorpay-key", isLoggedIn, getRozorpayApiKey);

router.post(
  "/subscribe",
  isLoggedIn,
  authorizedRoles("user", "creator"), // ✅ creator can subscribe
  buySubscription
);

router.post(
  "/verify",
  isLoggedIn,
  authorizedRoles("user", "creator"), // ✅ creator can verify
  verifySubscription
);

router.post(
  "/unsubscribe",
  isLoggedIn,
  authorizedRoles("user", "creator"), // ✅ creator can unsubscribe
  unsubscribe
);

// ADMIN ONLY
router.get(
  "/all",
  isLoggedIn,
  authorizedRoles("admin"),
  allPayment
);

export default router;