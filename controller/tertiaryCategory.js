const Tertiary = require("../models/tertiaryCategory");
const SecondaryCategory = require("../models/secondaryCategory");
const PrimaryCategory = require("../models/primaryCategory");

exports.createTertiaryCategory = async (req, res) => {
  try {
    const { secondaryCategoryId } = req.params;
    const check = await SecondaryCategory.findById(secondaryCategoryId);
    if (!check) {
      return res
        .status(200)
        .json({ success: false, message: "please select secondary category" });
    }
    const tertiary = await Tertiary.create({
      secondaryCategoryId,
      ...req.body,
    });
    return res.status(200).json({
      success: true,
      message: "TertiaryCategory Has Been Created",
      data: tertiary,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getTertiaryCategorybySec = async (req, res) => {
  try {
    const { secondaryCategoryId } = req.params;
    const check = await SecondaryCategory.findById(secondaryCategoryId);
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "No Secondary Category Found" });
    }
    const tertiary = await Tertiary.find({
      secondaryCategoryId,
      permanentDeleted: false,
    });

    return res
      .status(200)
      .json({ success: true, message: "Data Found", data: tertiary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllTertiary = async (req, res) => {
  try {
    const Data = await Tertiary.find({ permanentDeleted: false }).populate({
      path: "secondaryCategoryId",
      select: "title",
    });
    if (Data.length === 0) {
      return res.status(400).json({ success: false, message: "No Data found" });
    }
    return res.status(200).json({ success: true, data: Data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateTertiary = async (req, res) => {
  try {
    const { tertiaryId } = req.params;
    const check = await Tertiary.findById(tertiaryId);
    if (!check) {
      return res
        .status(404)
        .json({ success: true, message: "No Tertiary found" });
    }
    await Tertiary.findOneAndUpdate(
      { _id: tertiaryId, permanentDeleted: false },
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({ success: true, message: "Updated" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteTertiary = async (req, res) => {
  try {
    const { tertiaryId } = req.params;
    const check = await Tertiary.findOne({
      _id: tertiaryId,
      permanentDeleted: false,
    });
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No Tertiary Catagory by this id" });
    }
    await Tertiary.findByIdAndUpdate(
      tertiaryId,
      { permanentDeleted: "true" },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.navBar = async (req, res) => {
  try {
    // const newArr = check.map(async (category) => {
    //   let sub = await SecondaryCategory.find({
    //     primaryCategoryId: category._id,
    //   });
    //   return { category, sub };
    // });
    // let result = await Promise.all(newArr);

    const check = await PrimaryCategory.find({
      status: true,
      isNavbar: true,
      permanentDeleted: false,
    });

    const results = await Promise.all(
      check.map(async (primary) => {
        const secondary = await SecondaryCategory.find({
          primaryCategoryId: primary._id,
          permanentDeleted: "false",
        });

        const third = await Promise.all(
          secondary.map(async (sub) => {
            const type = await Tertiary.find({
              secondaryCategoryId: sub._id,
              permanentDeleted: "false",
            });

            return { subCategory: sub, subCategoryType: type };
          })
        );

        return {
          mainCategory: primary,
          // subCategory: secondary,
          type: third,
        };
      })
    );

    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getTertiaryById = async (req, res) => {
  try {
    const { tertiaryId } = req.params;
    const tertiary = await Tertiary.findById(tertiaryId).populate({
      path: "secondaryCategoryId",
      select: "title",
    });
    if (!tertiary) {
      return res
        .status(400)
        .json({ success: false, message: "No Tertiary Category By This Id!" });
    }
    return res.status(200).json({ success: true, data: tertiary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
