const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
    message: String,
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chat", chatSchema);
