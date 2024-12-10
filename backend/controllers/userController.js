const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("../middleware/asyncError");
const sendToken = require("../utils/jwtToken");

// Register User
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample id",
      url: "sample url",
    },
  });
  sendToken(user, 201, res);
});

// Login User
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

// Logout User
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Get User personal Details
const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// Change Password
const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(
      new ErrorHandler(
        "Please enter old and new password and confirm password",
        400
      )
    );
  }
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New password and confirm password do not match", 400)
    );
  }
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// Update user details
const updateUser = asyncHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  //image will be added later
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, user });
});

// Get all users (admin)
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// Get single user (admin)
const getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({ success: true, user });
});

// Update user role (admin)
const updateUserRole = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({ success: true, user });
});

// Delete user (admin)
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  changePassword,
  updateUser,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser
};
