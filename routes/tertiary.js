const express = require("express");

const TertiaryRoute = express.Router();
const adminAuth = require("../middleware/Adminauth");
const userAuth = require("../middleware/userAuth");
const {
  createTertiaryCategory,
  getAllTertiary,
  getTertiaryCategorybySec,
  updateTertiary,
  deleteTertiary,
  navBar,
  getTertiaryById,
} = require("../controller/tertiaryCategory");

TertiaryRoute.get("/getAllTertiary", getAllTertiary);
TertiaryRoute.delete("/deleteTertiary/:tertiaryId", deleteTertiary);
TertiaryRoute.patch("/updateTertiary/:tertiaryId", updateTertiary);
TertiaryRoute.post(
  "/createTertiaryCategory/:secondaryCategoryId",
  // userAuth,
  // adminAuth,
  createTertiaryCategory
);
TertiaryRoute.get(
  "/getTertiaryCategory/:secondaryCategoryId",
  getTertiaryCategorybySec
);
TertiaryRoute.get("/getTertiaryById/:tertiaryId", getTertiaryById);
TertiaryRoute.get("/navBar", navBar);

module.exports = TertiaryRoute;
