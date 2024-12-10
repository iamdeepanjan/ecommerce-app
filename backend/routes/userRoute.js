const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  changePassword,
  updateUser,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/change-password").patch(isAuthenticatedUser, changePassword);

router.route("/update-me").put(isAuthenticatedUser, updateUser);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRole("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRole("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRole("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteUser);

module.exports = router;
