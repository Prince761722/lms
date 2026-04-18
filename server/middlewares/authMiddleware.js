import appError from "../utils/errorUtil.js";
import jwt from "jsonwebtoken";
import Course from '../models/courseModel.js';
import User from '../models/userModel.js';

const isLoggedIn = (req, res, next) => {
  try {
    // check cookie first, then Authorization header
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new appError("Please login to access this resource", 401));
    }

    const userDetails = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;
    next();
  } catch (error) {
    return next(new appError("Invalid or expired token", 401));
  }
};

const authorizedRoles = (...roles) => async (req, res, next) => {
  const currentUserRole = req.user.role;
  if (!roles.includes(currentUserRole)) {
    return next(new appError('You do not have permission to access this route', 403));
  }
  next();
};

const isSubscribed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new appError("User not found", 404));
    }

    if (user.role === "admin") return next();

    if (user.subscription?.status !== "active") {
      return next(new appError("Please subscribe to access this resource", 403));
    }

    next();
  } catch (error) {
    return next(new appError(error.message, 500));
  }
};

const isCourseOwner = async (req, res, next) => {
  try {
    const courseId = req.params.id || req.params.courseId;

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new appError("Course not found", 404));
    }

    if (course.createdBy.toString() !== req.user.id) {
      return next(new appError("Only course creator can add lectures", 403));
    }

    next();
  } catch (error) {
    return next(new appError(error.message, 500));
  }
};

const isSubscribedOrOwner = async (req, res, next) => {
  try {
    const freshUser = await User.findById(req.user.id);

    if (!freshUser) {
      return next(new appError("User not found", 404));
    }

    const courseId = req.params.id || req.params.courseId;

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new appError("Course not found", 404));
    }

    if (freshUser.role === "admin") return next();

    if (course.createdBy.toString() === req.user.id) return next();

    if (freshUser.subscription?.status === "active") return next();

    return next(new appError("You are not subscribed to this course", 403));

  } catch (error) {
    return next(new appError(error.message, 500));
  }
};

const isAdminOrOwner = async (req, res, next) => {
  try {
    const user = req.user;
    const courseId = req.params.id || req.params.courseId;

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new appError("Course not found", 404));
    }

    if (user.role === "admin") return next();

    if (course.createdBy.toString() === user.id) return next();

    return next(new appError("Unauthorized access", 403));

  } catch (error) {
    return next(new appError(error.message, 500));
  }
};

export { isLoggedIn, authorizedRoles, isSubscribed, isCourseOwner, isSubscribedOrOwner, isAdminOrOwner };
