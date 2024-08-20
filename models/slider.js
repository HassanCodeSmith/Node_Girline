const mongoose = require("mongoose");

const Slider = new mongoose.Schema(
  {
    title: String,
    price: Number,
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
    imgUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("silder", Slider);
