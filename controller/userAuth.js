const User = require("../models/user");
const Address = require("../models/address");
const bcrypt = require("bcrypt");
const Otp = require("../models/otp");
const { validateEmail } = require("../utils/emailValidator");
const sendEmail = require("../utils/sendEmail");
const Datauri = require("datauri/parser");
const jwt = require("jsonwebtoken");
const dUri = new Datauri();
const path = require("path");
const cloudinary = require("cloudinary").v2;
const upload = require("../utils/upload");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
aUri = (buffer, originalname) =>
  dUri.format(path.extname(originalname).toString(), buffer);

/**
 * User SignUP
 */
exports.UserSignUp = async (req, res) => {
  try {
    const find = await User.findOne({
      email: req.body.email,
      permanentDeleted: false,
    });
    if (find) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }
    if (!req.body.password) {
      return res.status(400).json({
        status: "error",
        message: "Password is required",
      });
    }
    if (!validateEmail(req.body.email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is not valid",
      });
    }
    const { password, confirmpassword } = req.body;
    if (password !== confirmpassword) {
      return res.status(400).json({
        status: "error",
        message: "Password is Not Matched",
      });
    }

    const signUpOtp = (Math.floor(Math.random() * 899999) + 100000).toString();
    console.log(signUpOtp);
    const otp = await Otp.create({ email: req.body.email, otp: signUpOtp });

    const { firstName, lastName, email } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: req.body.role,
    });
    console.log(user.isverified);
    const mail = {
      to: email,
      subject: "Your Otp is",
      html: `${signUpOtp}`,
    };
    console.log(mail);
    sendEmail(mail);
    // const token = await user.createJWT();
    return res.status(200).json({
      //   access_token: token,
      status: "success",
      message: "Otp has been sent to your email",
      data: {
        firstName,
        lastName,
        email,
        isverified: user.isverified,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Verify OTP
 */
exports.verifyOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const OTP = req.body.OTP;
    console.log(`Email for verifyOTP - Testing - ${email}`);

    if (!OTP) {
      return res.status(400).json({
        status: "false",
        message: "Otp is required",
      });
    }
    // const { email, otp } = req.body;
    const findotp = await Otp.findOne({ email, permanentDeleted: false });
    console.log(`User onbehalf of verifyOTP: ${findotp}`);
    if (!findotp) {
      return res.status(400).json({
        status: "error",
        message: "OTP has been expired!",
      });
    }
    const isOtp = await findotp.compareotp(OTP);
    console.log(isOtp);
    if (!isOtp) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      });
    }
    const user = await User.findOneAndUpdate(
      { email, permanentDeleted: false },
      { isverified: true }
    );
    const token = await user.createJWT();
    return res.status(200).json({
      success: true,
      message: "Successfully verified OTP",
      data: {
        access_token: token,
        isverified: user.isverified,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ success: false, message: "Invalid OTP...." });
  }
};

/**
 * Resend OTP
 */
exports.resendOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const check = await User.findOne({ email });
    if (!check) {
      return res.status(400).json({ success: false, message: "Wrong email" });
    }
    await Otp.findOneAndRemove({ email });

    const signUpOtp = (Math.floor(Math.random() * 899999) + 100000).toString();
    console.log(signUpOtp);
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(signUpOtp, salt);
    await User.findOneAndUpdate(
      { email },
      {
        forgotPasswordOtp: hashedOtp,
        forgotPasswordOtpExpire: Date.now() + 5 * 60 * 1000,
      }
    );
    const otp = await Otp.create({ email: req.body.email, otp: signUpOtp });
    const mail = {
      to: email,
      subject: "Your OTP is",
      html: `${signUpOtp}`,
    };
    console.log(mail);
    sendEmail(mail);
    return res.status(200).json({
      success: true,
      message: "OTP has sent to you",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * User Login
 */
exports.UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is not valid",
      });
    }
    const find = await User.findOne({
      email,
    });

    // console.log(find);
    if (!find) {
      return res.status(400).json({
        status: "error",
        message: "Email does not exist",
      });
    }

    if (find.permanentDeleted) {
      return res.status(400).json({
        status: "error",
        message: "Your account deleted by admin",
      });
    }

    if (find.softDelete) {
      return res.status(400).json({
        status: "error",
        message: "The user account has been deleted.",
      });
    }

    if (!find.isverified) {
      return res.status(400).json({
        status: "error",
        message: "You blocked by admin",
      });
    }

    if (find.isSocialLogin === true) {
      return res.status(400).json({
        success: false,
        message: "You have to login through social media",
      });
    }
    const isPassword = await find.comparePassword(password);
    console.log(isPassword);
    if (!isPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password is not correct" });
    }
    // if(!find.isverified){
    //   return res.status(400).json({success:false, message: "You are not verified"})
    // }
    const token = await find.createJWT();
    return res.status(200).json({
      success: true,
      data: {
        firstName: find.firstName,
        lastName: find.lastName,
        _id: find.id,
        profilePic: find.profileUrl,
        access_token: token,
        email: find.email,
      },
      access_token: token,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Forgot Password
 */
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const checkfp = await User.findOne({
      email,
      permanentDeleted: false,
      softDelete: false,
    });
    if (!checkfp) {
      return res
        .status(400)
        .json({ success: false, message: "No user found with email address" });
    }

    const forgetPasswordOtp = (
      Math.floor(Math.random() * 899999) + 100000
    ).toString();

    console.log(forgetPasswordOtp);
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(forgetPasswordOtp, salt);
    await User.findOneAndUpdate(
      { email },
      {
        forgotPasswordOtp: hashedOtp,
        forgotPasswordOtpExpire: Date.now() + 5 * 60 * 1000,
      }
    );
    const mail = {
      to: email,
      subject: "Your OTP is",
      html: `${forgetPasswordOtp}`,
    };
    console.log(mail);
    sendEmail(mail);
    return res
      .status(200)
      .json({ success: true, message: "OTP Has been sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error });
  }
};

/**
 * Verify Forgot Password OTP (One Time Password)
 */
exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    let { email, forgotPasswordOtp } = req.body;
    console.log(req.body);
    if (!email || !forgotPasswordOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Fill required fields" });
    }
    console.log(email, forgotPasswordOtp);
    email = email.toLowerCase();
    // console.log(email);
    if (!forgotPasswordOtp) {
      return res.status(400).json({ message: "OTP cannot be blank" });
    }
    // verifying user
    const user = await User.findOne({
      email,
      forgotPasswordOtpExpire: { $gt: Date.now() },
      permanentDeleted: false,
      softDelete: false,
    });
    if (!user) {
      return res.status(404).json({ message: "Session expired" });
    }

    // comparing otp
    const valid = await user.campareForgotPasswordOtp(forgotPasswordOtp);

    console.log(valid);
    if (valid) {
      await User.findOneAndUpdate(
        { email, permanentDeleted: false },

        {
          setNewPwd: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    }
    return res.status(400).json({ message: "Invalid Otp" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

/**
 * Reset Password
 */
exports.resetPassword = async (req, res) => {
  try {
    let { email } = req.body;
    // console.log(resetToken);
    email = email.toLowerCase();
    const oldUser = await User.findOne({
      email,
      permanentDeleted: false,
      softDelete: false,
    });
    if (!oldUser?.setNewPwd) {
      return res
        .status(400)
        .json({ success: false, message: "You are not allowed to do that" });
    }

    let { password, confirmPassword } = req.body;
    console.log(password, confirmPassword);

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password don't match" });
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const user = await User.findOneAndUpdate(
      { email },
      { password, setNewPwd: false }
    );

    return res
      .status(200)
      .json({ message: "New password successfully updated" });
  } catch (error) {
    console.log(error);

    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Change Password
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { userId } = req.user;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "All input fields must be provided.",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password is not matched",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "No user found" });
    }
    const isValid = await user.comparePassword(oldPassword);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate(
      { _id: userId, permanentDeleted: false },
      {
        password,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Your password has heen updated successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Profile Pic
 */
exports.profilePic = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "You must select atleast one image to continue",
      });
    }

    // const file = dataUri(req.file.buffer, req.file.originalname).content;
    // // console.log(file);
    // const profile = await cloudinary.uploader.upload(file);
    const profileUrl = req.file.location;

    // console.log("=========>", profileUrl);
    const data = await User.findOneAndUpdate(
      { _id: userId, permanentDeleted: false },
      {
        profileUrl,
      },
      { runValidators: true, new: true }
    );

    // console.log(data);
    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully ",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Google Login
 */
exports.googleLogin = async (req, res) => {
  try {
    const idToken = req.body.idToken;
    const decoded = jwt.decode(idToken, { complete: true });

    const { email } = decoded.payload;
    console.log("email by google login: ", email);
    // Check if the user already exists in the database
    let user = await User.findOne({ email });
    if (!user) {
      const newUser = await User.create({
        email: decoded.payload.email,
        firstName: decoded.payload.given_name,
        lastName: decoded.payload.family_name,
        profileUrl: decoded.payload.picture,

        isSocialLogin: true,
      });

      const token = await newUser.createJWT();
      return res.status(200).json({
        success: true,
        data: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          _id: newUser.id,
          profilePic: newUser.profileUrl,
          access_token: token,
          email: newUser.email,
        },
        access_token: token,
      });
    }

    if (user.permanentDeleted === true) {
      console.log(`Your account with email ${email} has been deleted by admin`);
      return res.status(200).json({
        success: true,
        message: `Your account with email ${email} has been deleted by admin`,
      });
    }

    const token = await user.createJWT();
    return res.status(200).json({
      success: true,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user.id,
        profilePic: user.profileUrl,
        access_token: token,
        email: user.email,
      },
      access_token: token,
    });
    // Create a session for the user and send the session ID to the client
    // const sessionId = createSession(user._id);
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid id token");
  }
};

///******** WEB_ADMIN LOGIN SIGNUP*********///

/**
 * Admin Login
 */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(403)
        .json({ success: false, message: "Email or password cannot be empty" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const find = await User.findOne({ email, permanentDeleted: false });
    if (!find) {
      return res
        .status(404)
        .json({ success: false, message: "Email address not found" });
    }
    const isPassword = await find.comparePassword(password);
    if (!isPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password is incorrect" });
    }

    const token = await find.createJWT();
    return res.status(200).json({
      success: true,
      message: "Login successfully!",
      access_token: token,
      data: {
        firstName: find.firstName,
        lastName: find.lastName,
        _id: find.id,
        role: find.role,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Admin Sighup
 */
exports.adminSignUp = async (req, res) => {
  try {
    const find = await User.findOne({
      email: req.body.email,
      permanentDeleted: false,
    });
    if (find) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }
    if (!req.body.password) {
      return res.status(400).json({
        status: "error",
        message: "Password is required",
      });
    }
    if (!validateEmail(req.body.email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is not valid",
      });
    }
    const { firstName, lastName, email } = req.body;
    const user = await User.create({ ...req.body });
    return res.status(200).json({
      //   access_token: token,
      status: "success",
      message: "Successfully signed up",
      data: {
        firstName,
        lastName,
        email,
        isverified: true,
        role: "admin",
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get User Profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const userData = await User.findOne({
      _id: userId,
      permanentDeleted: false,
    }).select(
      "-password -permanentDeleted -isverified -resetPasswordToken -resetPasswordTokenExpire -favProduct -setNewPwd -wishlist -subscription -forgotPasswordOtpExpire -isSocialLogin -forgotPasswordOtp"
    );
    const address = await Address.find({ userId });
    // console.log(">>>>>", getData);
    // console.log("><><><><", address);
    return res.status(200).json({ success: true, data: { userData, address } });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Users
 */
exports.getUsers = async (req, res) => {
  try {
    const getData = await User.find({
      permanentDeleted: false,
    }).select(
      "-password  -resetPasswordToken -resetPasswordTokenExpire -favProduct -setNewPwd -wishlist -subscription -forgotPasswordOtpExpire -isSocialLogin -forgotPasswordOtp"
    );
    return res.status(200).json({ success: true, data: getData });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * User Status Change
 */
exports.userStatusChange = async (req, res) => {
  try {
    const { id } = req.params;

    const find = await User.findById(id);
    if (!find) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const statusChange = await User.findOneAndUpdate(
      { _id: id },
      { $set: { isverified: !find.isverified } },
      { new: true }
    );
    let message = "";
    if (statusChange.isverified) {
      message = "User is active";
    } else {
      message = "User is blocked";
    }

    return res.status(200).json({ success: true, message: message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete User by admin => {permanentDeleted : true}
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { permanentDeleted: true });
    console.log("User deleted successfully");
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(`Error - deleteUser - catch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: `Error - deleteUser - catch - ${error.message}`,
    });
  }
};

/**
 * Delete My Account => {softDelete: true}
 */
exports.deleteMyAccount = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findOne({ _id: userId });

    if (user.softDelete) {
      return res.status(400).json({
        success: false,
        message: "Account already deleted by user",
      });
    }

    if (user.permanentDeleted) {
      return res.status(400).json({
        success: false,
        message: "Account already deleted by admin",
      });
    }

    (user.softDelete = true), await user.save();

    return res.status(200).json({
      success: true,
      message: "Your account has been deleted",
    });
  } catch (error) {
    console.log("An error occurred while deleted your account: ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting your account",
    });
  }
};
