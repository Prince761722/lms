import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import razorpay from "../config/razorpayConfig.js";
import User from "../models/userModel.js";
import payment from "../models/paymentModel.js";
import appError from "../utils/errorUtil.js";


export const getRozorpayApiKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return next(new appError("Failed to fetch Razorpay key", 500));
  }
};


export const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return next(new appError("Unauthorized user", 401));
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
      total_count: 12,
    });

    user.subscription = {
      id: subscription.id,
      status: subscription.status,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription created successfully",
      subscription_id: subscription.id,
    });

  } catch (error) {
    console.log("SUBSCRIBE ERROR:", error);
    return next(new appError(error.message || "Subscription failed", 500));
  }
};


export const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

  
    if (
      !razorpay_payment_id ||
      !razorpay_subscription_id ||
      !razorpay_signature
    ) {
      return next(new appError("Missing payment details", 400));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(new appError("Unauthorized user", 401));
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(new appError("Payment verification failed", 400));
    }


    await payment.create({
      user: user._id,
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      status: "paid",
      plan_id: process.env.RAZORPAY_PLAN_ID,
      amount: 49900,
    });


    user.subscription.status = "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    return next(new appError(error.message || "Verification failed", 500));
  }
};


export const unsubscribe = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return next(new appError("Unauthorized user", 401));
    }

    const subscriptionId = user.subscription?.id;

    if (!subscriptionId) {
      return next(new appError("No active subscription found", 400));
    }

    const subscription = await razorpay.subscriptions.cancel(subscriptionId);

    user.subscription.status = subscription.status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
    });

  } catch (error) {
    console.log("UNSUBSCRIBE ERROR:", error);
    return next(new appError(error.message || "Unsubscribe failed", 500));
  }
};

// =====================
// ADMIN: ALL PAYMENTS
// =====================
export const allPayment = async (req, res, next) => {
  try {
    const stats = await payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalPayments: { $sum: 1 },
        },
      },
    ]);

    const monthlyStats = await payment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          payments: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const yearlyStats = await payment.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          revenue: { $sum: "$amount" },
          payments: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1 } },
    ]);

    const recentPayments = await payment
      .find()
      .populate("user", "firstname email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      overview: stats[0] || { totalRevenue: 0, totalPayments: 0 },
      monthlyStats,
      yearlyStats,
      recentPayments,
    });

  } catch (error) {
    console.log("ALL PAYMENTS ERROR:", error);
    return next(new appError(error.message || "Failed to fetch payments", 500));
  }
};