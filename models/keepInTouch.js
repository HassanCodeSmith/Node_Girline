const mongoose = require("mongoose");

const keepInTouchSchema = new mongoose.Schema(
  {
    email: String,
    subscribe: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const KeepInTouch = mongoose.model("KeepInTouch", keepInTouchSchema);

module.exports = KeepInTouch;
