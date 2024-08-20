const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: { type: String, required: [true, "please Provide a last name"] },
    email: {
      type: String,
      required: [true, "please Provide a email"],
      unique: true,
    },
    password: { type: String },

    profileUrl: String,

    isverified: { type: Boolean, default: false },
    isSocialLogin: { type: Boolean, default: false },
    wishlist: [{ type: String }],
    setNewPwd: { type: Boolean, default: false },
    favProduct: [{ productId: String }],
    forgotPasswordOtp: { type: String },
    subscription: { type: Boolean, default: false },
    forgotPasswordOtpExpire: {
      type: Date,
      default: "",
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordTokenExpire: {
      type: Date,
      default: "",
    },

    softDelete: {
      type: Boolean,
      default: false,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
User.pre("save", async function () {
  if (!this.isSocialLogin) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});
User.methods.comparePassword = async function (candidatePassword) {
  console.log("Candidate Password: ", candidatePassword);
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
User.methods.createJWT = function () {
  // console.log(this);
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
User.methods.campareForgotPasswordOtp = async function (forgotPasswordOtp) {
  const isMatch = await bcrypt.compare(
    forgotPasswordOtp,
    this.forgotPasswordOtp
  );
  return isMatch;
};
module.exports = mongoose.model("User", User);
