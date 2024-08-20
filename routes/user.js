const express = require("express");
const UserRoute = express.Router();
const auth = require("../middleware/userAuth");
const adminAuth = require("../middleware/Adminauth");
const { upload } = require("../utils/upload");

const {
  UserSignUp,
  UserLogin,
  verifyOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
  changePassword,
  profilePic,
  adminSignUp,
  adminLogin,
  googleLogin,
  getUserProfile,
  getUsers,
  userStatusChange,
  verifyForgotPasswordOtp,
  deleteUser,
  deleteMyAccount,
} = require("../controller/userAuth");
// const { Auth } = require("googleapis");

UserRoute.post("/signup", UserSignUp);
UserRoute.post("/googleLogin", googleLogin);
UserRoute.post("/userLogin", UserLogin);
UserRoute.post("/verifyOtp", verifyOtp);
UserRoute.post("/resendOtp", resendOtp);
UserRoute.patch("/forgetPassword", forgetPassword);
UserRoute.patch("/profilePic", auth, upload.single("image"), profilePic);
UserRoute.post("/verifyForgotPasswordOtp", verifyForgotPasswordOtp);

UserRoute.patch("/resetPassword", resetPassword);
UserRoute.patch("/changePassword", auth, changePassword);

UserRoute.patch("/deleteMyAccount", auth, deleteMyAccount);

UserRoute.post("/admin/Login", upload.none(), adminLogin);
UserRoute.post("/admin/SignUp", adminSignUp);
UserRoute.get("/admin/getUserProfile", auth, getUserProfile);
UserRoute.get("/admin/getUsers", getUsers);

UserRoute.patch("/admin/resetPassword", resetPassword);
UserRoute.patch("/admin/forgetPassword", forgetPassword);
UserRoute.post("/admin/deleteUser/:id", deleteUser);
UserRoute.patch(
  "/admin/userStatusChange/:id",
  // auth,
  // adminAuth,
  userStatusChange
);
module.exports = UserRoute;
