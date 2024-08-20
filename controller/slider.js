const Slider = require("../models/slider");
const Product = require("../models/product");
const trimObjects = require("../utils/trimObjects");

/**
 * Add Slider
 */
exports.Slider = async (req, res) => {
  try {
    trimObjects(req.body);
    const { title, price, productId } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ succuss: false, message: "Please select some pictures" });
    }
    let imgUrl = req.file.location;

    const addSlider = await Slider.create({ imgUrl, title, price, productId });
    console.log("data: ", addSlider);
    return res.status(200).json({
      success: true,
      message: "Slider added successfuly",
      data: addSlider,
    });
  } catch (error) {
    return res.status(400).json({ succuss: false, message: error.message });
  }
};

/**
 * Get Slider
 */
exports.getSlider = async (req, res) => {
  try {
    const slider = await Slider.find({}).populate("productId");

    if (slider.length === 0) {
      return res.status(200).json({ success: false, message: slider });
    }

    return res.status(200).json({ success: true, message: slider });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Add Product To Slider
 */
exports.addProductToSlider = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.body;
    const check = await Product.findById(productId);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No Product Found" });
    }
    const productSlider = await Slider.create({ productId });
    return res
      .status(200)
      .json({ success: true, message: "Product has been added to Slider" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete Slider
 */
exports.deleteSlider = async (req, res) => {
  try {
    const { sliderId } = req.params;
    const slider = await Slider.findById(sliderId);
    if (!slider) {
      return res.status(400).json({
        success: false,
        message: `No slider find by this id:${sliderId}`,
      });
    }
    await Slider.findByIdAndRemove(sliderId);
    return res
      .status(200)
      .json({ success: true, message: "Slider deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Edit Slider
 */
exports.updateSlider = async (req, res) => {
  try {
    trimObjects(req.body);
    const { id } = req.params;
    console.log("param id", id);
    const { title, price, productId } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ succuss: false, message: "Please select some pictures" });
    }
    let imgUrl = req.file.location;

    await Slider.findOneAndUpdate(
      { _id: id },
      { imgUrl, title, price, productId }
    );

    return res.status(200).json({
      success: true,
      message: "Slider update successfully.",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
