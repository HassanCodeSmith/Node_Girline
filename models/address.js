const mongoose = require("mongoose");

const Address = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    // state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "pakistan" },
    phoneNumber: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("adress", Address);
