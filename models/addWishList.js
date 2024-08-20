const mongoose = require("mongoose");

const addWishList = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "user" },
  productId: { type: mongoose.Types.ObjectId, ref: "product" },
});

module.exports = mongoose.model("addWishlist", addWishList);
