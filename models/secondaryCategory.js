const mongoose = require("mongoose");

const secondaryCategory = new mongoose.Schema(
  {
    title: String,
    primaryCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "primaryCategory",
    },
    New: {
      type: Boolean,
      default: false,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
    isNavbar: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("secondaryCategory", secondaryCategory);
