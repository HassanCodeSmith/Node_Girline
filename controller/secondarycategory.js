const SecondaryCategory = require("../models/secondaryCategory");
const PrimaryCategory = require("../models/primaryCategory");
const TertiaryCategory = require("../models/tertiaryCategory");

exports.createSecondaryCategory = async (req, res) => {
  try {
    const { primaryCategoryId } = req.params;
    const secondaryCategory = req.body.title;
    // console.log(req.params);
    const check = await PrimaryCategory.findOne({
      _id: primaryCategoryId,
      permanentDeleted: false,
    });
    // console.log("helooooooooooooooo", check);
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "No primary category found" });
    }
    const regex = new RegExp("^" + secondaryCategory + "$", "i");
    const find = await SecondaryCategory.findOne({
      title: regex,
      permanentDeleted: false,
    });
    if (find) {
      return res.status(400).json({
        success: false,
        message: `${secondaryCategory} already exist Under this Primary Category`,
      });
    }
    const category = await SecondaryCategory.create({
      primaryCategoryId,
      ...req.body,
    });
    return res.status(200).json({
      success: true,
      message: "Secondary category created successfully",
      data: category,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllSecondryCategories = async (req, res) => {
  try {
    const category = await SecondaryCategory.find({
      permanentDeleted: false,
    }).populate("primaryCategoryId");
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.getSecondaryByPrimary = async (req, res) => {
  try {
    const { primaryCategoryId } = req.params;
    const check = await PrimaryCategory.findById(primaryCategoryId);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No primary Category with Given Id" });
    }
    const secondary = await SecondaryCategory.find({
      primaryCategoryId,
      permanentDeleted: false,
    });

    console.log(secondary);
    return res.status(200).json({ success: true, data: secondary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateSecondaryCategory = async (req, res) => {
  try {
    const { secondaryCategoryId } = req.params;
    console.log(req.body);
    const check = await SecondaryCategory.findById(secondaryCategoryId);
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "No secondary category found" });
    }
    await SecondaryCategory.findOneAndUpdate(
      { _id: secondaryCategoryId, permanentDeleted: false },
      { ...req.body },
      {
        new: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Secondary category updated successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSecondaryCategory = async (req, res) => {
  try {
    const { secondaryCategoryId } = req.params;
    const check = await SecondaryCategory.findOne({
      _id: secondaryCategoryId,
      permanentDeleted: false,
    });
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "No Secondary Category with Given Id",
      });
    }
    await SecondaryCategory.findOneAndUpdate(
      { _id: secondaryCategoryId },
      { permanentDeleted: "true" },
      {
        new: true,
      }
    );
    await TertiaryCategory.findOneAndUpdate(
      { secondaryCategoryId },
      {
        permanentDeleted: true,
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ success: true, message: "Secondary category deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSecondaryById = async (req, res) => {
  try {
    const { secondaryCategoryId } = req.params;
    const secondary = await SecondaryCategory.findById(
      secondaryCategoryId
    ).populate({
      path: "primaryCategoryId",
      select: "title",
    });
    if (!secondary) {
      return res
        .status(400)
        .json({ success: false, message: "No Secondary Category By This Id!" });
    }
    return res.status(200).json({ success: true, data: secondary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
