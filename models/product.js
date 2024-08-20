const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    productName: { type: String },
    primaryCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "primaryCategory",
    },
    secondaryCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "secondaryCategory",
    },
    tertiaryCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "tertiaryCategory",
    },
    // tertiaryCategoryTitle: { type: String },
    price: { type: Number },
    isFeatured: { type: Boolean, default: false },
    description: { type: String },
    // color: [String],
    quantity: { type: Number, default: 0 },
    numSales: { type: Number, default: 0 },
    isSlider: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    imageColors: [
      {
        color: {
          type: String,
          required: true,
        },
        imgUrl: {
          type: String,
          required: true,
        },
      },
    ],
    onSale: { type: Boolean, default: false },
    discountedPrice: { type: Number, default: 0 },
    new: { type: Boolean, default: false },
    permanentDeleted: { type: Boolean, default: false },
    productType: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", Product);
