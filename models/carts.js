const mongoose = require("mongoose");

const Carts = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: String, required: true },
        price: { type: String, required: true },
      },
    ],
    totalPrice: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("carts", Carts);
