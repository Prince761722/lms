import User from "../models/userModel.js";
import appError from "../utils/errorUtil.js";


export const requestCreatorAccess = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new appError("User not found", 404));
    }


    if (user.role === "creator") {
      return next(new appError("You are already a creator", 400));
    }


    if (user.creatorRequest && user.creatorRequest.status === "pending") {
      return next(new appError("Your request is already pending", 400));
    }


    user.creatorRequest = {
      status: "pending",
      requestedAt: new Date(),
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Request sent to admin",
    });

  } catch (error) {
    return next(new appError(error.message, 500));
  }
};



export const handleCreatorRequest = async (req, res, next) => {
  try {
    const { userId, action } = req.body;


    if (!["approve", "reject"].includes(action)) {
      return next(new appError("Invalid action", 400));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new appError("User not found", 404));
    }


    if (!user.creatorRequest) {
      return next(new appError("No creator request found", 400));
    }

    if (user.creatorRequest.status !== "pending") {
      return next(new appError("Request already processed", 400));
    }


    if (action === "approve") {
      user.role = "creator";
      user.creatorRequest.status = "approved";
    } else {
      user.creatorRequest.status = "rejected";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message:
        action === "approve"
          ? "Request approved successfully"
          : "Request rejected successfully",
    });

  } catch (error) {
    return next(new appError(error.message, 500));
  }
};



export const getCreatorRequests = async (req, res, next) => {
  try {
    const users = await User.find(
      { "creatorRequest.status": "pending" },
      "firstname lastname email creatorRequest" // ✅ fixed field names
    );

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    return next(new appError(error.message, 500));
  }
};