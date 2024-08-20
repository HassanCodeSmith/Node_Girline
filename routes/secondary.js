const express = require("express");

const SecondaryRoute = express.Router();
const adminAuth = require("../middleware/Adminauth");
const userAuth = require("../middleware/userAuth");

const {
  createSecondaryCategory,
  getAllSecondryCategories,
  getSecondaryByPrimary,
  updateSecondaryCategory,
  deleteSecondaryCategory,
  getSecondaryById,
} = require("../controller/secondarycategory");

SecondaryRoute.post(
  "/createSecondaryCategory/:primaryCategoryId",
  // userAuth,
  // adminAuth,
  createSecondaryCategory
);
SecondaryRoute.get(
  "/getAllSecondryCategories",
  // userAuth,
  // adminAuth,
  getAllSecondryCategories
);
SecondaryRoute.get(
  "/getSecondaryByPri/:primaryCategoryId",
  // userAuth,
  // adminAuth,
  getSecondaryByPrimary
);
SecondaryRoute.patch(
  "/updateSecondaryCategory/:secondaryCategoryId",
  // userAuth,
  // adminAuth,
  updateSecondaryCategory
);
SecondaryRoute.get(
  "/getSecondaryById/:secondaryCategoryId",
  // userAuth,
  // adminAuth,
  getSecondaryById
);
SecondaryRoute.delete(
  "/deleteSecondaryCategory/:secondaryCategoryId",
  // userAuth,
  // adminAuth,
  deleteSecondaryCategory
);

module.exports = SecondaryRoute;
