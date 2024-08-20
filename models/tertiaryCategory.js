const mongoose = require("mongoose");

const tertiary = new mongoose.Schema(
  {
    title: { type: String, required: true },

    primaryCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "primaryCategory",
    },
    secondaryCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "secondaryCategory",
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

module.exports = mongoose.model("tertiaryCategory", tertiary);
