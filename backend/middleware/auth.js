const asyncHandler = require("./asyncError");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  // console.log(token);
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Your role, ${req.user.role} are not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

module.exports = { isAuthenticatedUser, authorizeRole };
