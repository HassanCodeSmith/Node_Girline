const express = require("express");

const PrimaryRoute = express.Router();
const { upload } = require("../utils/upload");

const adminAuth = require("../middleware/Adminauth");
const userAuth = require("../middleware/userAuth");

const {
  getAllprimaryCategory,
  createprimaryCategory,
  deleteprimaryCategory,
  updateprimaryCategory,
  activeInActiveprimaryCategory,
  getPrimaryById,
} = require("../controller/primaryCategory");

PrimaryRoute.get(
  "/getAllprimaryCategory",
  // userAuth,
  // adminAuth,
  getAllprimaryCategory
);
PrimaryRoute.get(
  "/getprimaryById/:primaryCategoryId",
  // userAuth,
  // adminAuth,
  getPrimaryById
);
PrimaryRoute.post(
  "/admin/createprimaryCategory",
  // userAuth,
  // adminAuth,
  upload.single("image"),
  createprimaryCategory
);
PrimaryRoute.delete(
  "/admin/deleteprimaryCategory/:primaryCategoryId",
  // userAuth,
  // adminAuth,
  deleteprimaryCategory
);
PrimaryRoute.patch(
  "/admin/updateprimaryCategory/:primaryCategoryId",
  // userAuth,
  // adminAuth,
  upload.single("image"),
  updateprimaryCategory
);
PrimaryRoute.patch(
  "/admin/activeInActiveprimaryCategory/:primaryCategoryId",
  // userAuth,
  // adminAuth,
  activeInActiveprimaryCategory
);

module.exports = PrimaryRoute;
