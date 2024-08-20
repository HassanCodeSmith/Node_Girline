const mongoose = require("mongoose");

const orderHistory = new mongoose.Schema(
  {
    userId: { type: String },
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "product",
          required: true,
        },
        productName: { type: String, required: true },
        variationId: { type: String, required: true },
        price: { type: String, required: true },
        quantity: { type: String, required: true },
        color: { type: String, required: true },
        imgUrl: {
          type: String,
          required: true,
        },
      },
    ],
    shippingDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: String,
      address: { type: String, required: true },
      country: { type: String, required: true, default: "pakistan" },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    totalPrice: { type: Number },
    subTotal: { type: Number },
    // shippingDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderHistory", orderHistory);
