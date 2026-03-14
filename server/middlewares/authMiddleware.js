import appError from "../utils/errorUtil.js";
import jwt from "jsonwebtoken";

const isLoggedIn = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(
        new appError("Please login to access this resource", 401)
      );
    }

    const userDetails = jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;
    next();
  } catch (error) {
    return next(new appError("Invalid or expired token", 401));
  }
};

const authorizedRoles=(...roles)=> async (req,res,next)=>{
  const currentUserRole=req.user.role;
  if (!roles.includes(currentUserRole)){
    return next(
      new appError('you dont have permission to access this routes')
    )
  }
  next();
}

export { isLoggedIn,authorizedRoles };
