const mongoose = require("mongoose");

const PrimaryCategory = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { type: Boolean, default: true },
    New: { type: Boolean, default: false },
    imgUrl: String,
    permanentDeleted: { type: Boolean, default: false },
    isNavbar: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("primaryCategory", PrimaryCategory);
