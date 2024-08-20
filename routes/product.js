const express = require("express");
const multer = require("multer");

const ProductRoute = express.Router();
const userAuth = require("../middleware/userAuth");

const { upload } = require("../utils/upload");

// Middleware to handle multer errors
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error (e.g., file size exceeded)
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Other multer-related errors
    return res.status(400).json({
      error: "Invalid file type. For images, PNG, JPG, JPEG are allowed.",
    });
  }
  // If no multer error occurred, pass control to the next middleware/route handler
  next();
};

const {
  addProduct,
  priceRange,
  getProductByPrimaryCategory,
  getonSale,
  // buyProduct,
  getLatestProduct,
  searchApi,
  newArrival,
  topSales,
  getProductByFr,
  getAllProducts,
  addToWishList,
  getwishlist,
  removeWishList,
  getOrderHistory,
  buyProductApp,
  getProductById,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  deleteOrderHistory,
  updateProductById,
  filter,
  addToFave,
  getRelatedProducts,
  bestSelling,
  getAllPayments,
} = require("../controller/product");

ProductRoute.post(
  "/admin/addProduct",
  userAuth,
  upload.any(),
  handleMulterErrors,
  addProduct
);
// ProductRoute.post("/buyProduct", buyProduct);
ProductRoute.post("/buyProductApp", userAuth, buyProductApp);
ProductRoute.post("/addToWishList", userAuth, addToWishList);
ProductRoute.post("/addToFave", userAuth, addToFave);
ProductRoute.get("/getwishlist", userAuth, getwishlist);
ProductRoute.post("/removeWishList", userAuth, removeWishList);
ProductRoute.get("/priceRange", priceRange);
ProductRoute.get("/onSale", getonSale);
ProductRoute.get("/searchApi", searchApi);
ProductRoute.get("/getLatestProduct", getLatestProduct);
ProductRoute.get("/newArrival", newArrival);
ProductRoute.get("/shopSales", topSales);
ProductRoute.get("/getAllProducts", getAllProducts);
ProductRoute.get("/getOrderHistory", userAuth, getOrderHistory);
ProductRoute.get("/getProductDetailById/:productId", getProductById);
ProductRoute.patch("/deleteProduct/:productId", deleteProduct);
ProductRoute.get("/getProductById/:categoryId", getProductByFr);
ProductRoute.get(
  "/getProductByPrimaryCategory/:primaryCategoryId",
  getProductByPrimaryCategory
);

ProductRoute.get("/admin/getOrders", getOrders);
ProductRoute.patch("/updatestatus/:orderId", updateOrderStatus);
ProductRoute.patch(
  "/updateProductById/:productId",
  upload.any(),
  updateProductById
);
ProductRoute.delete("/deleteOrderHistory", userAuth, deleteOrderHistory);
ProductRoute.post("/filterProduct", filter);
ProductRoute.get("/getRelatedProducts/:productId", getRelatedProducts);
ProductRoute.get("/getTopSelling", bestSelling);
ProductRoute.get("/getAllPayments", getAllPayments);

module.exports = ProductRoute;
