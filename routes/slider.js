const express = require("express");

const SliderRoute = express.Router();
const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/Adminauth");

const { upload } = require("../utils/upload");

const {
  Slider,
  getSlider,
  addProductToSlider,
  deleteSlider,
  updateSlider,
} = require("../controller/slider");

SliderRoute.post("/addslider", upload.single("imgUrl"), Slider);
SliderRoute.patch("/updateSlider/:id", upload.single("imgUrl"), updateSlider);
SliderRoute.post(
  "/addProductToSlider",
  // userAuth,
  // adminAuth,
  addProductToSlider
);

SliderRoute.get("/getSlider", getSlider);
SliderRoute.delete("/deleteslider/:sliderId", deleteSlider);

module.exports = SliderRoute;
