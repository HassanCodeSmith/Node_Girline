const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Otp = new mongoose.Schema({
  email: { type: String },
  otp: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 300 },
  },
});
// Otp.pre("save", async function () {
//   const salt = await bcrypt.genSalt(10);
//   this.otp = await bcrypt.hash(this.otp, salt);
// });

Otp.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
});
Otp.methods.compareotp = async function (candidateotp) {
  const isMatch = await bcrypt.compare(candidateotp, this.otp);
  return isMatch;
};
module.exports = mongoose.model("otp", Otp);
