const primaryCategory = require("../models/primaryCategory");
const TertiaryCategory = require("../models/tertiaryCategory");
const SecondaryCategory = require("../models/secondaryCategory");

exports.getAllprimaryCategory = async (req, res) => {
  try {
    const data = await primaryCategory.find({ permanentDeleted: false });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.createprimaryCategory = async (req, res) => {
  try {
    const PrimaryCategory = req.body.title;
    const regex = new RegExp("^" + PrimaryCategory + "$", "i");
    const check = await primaryCategory.findOne({
      title: regex,
      permanentDeleted: false,
    });
    // console.log(check);
    if (check) {
      return res
        .status(400)
        .json({ success: false, message: `${PrimaryCategory} already exist` });
    }
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "you must select atleast one image to continue",
      });
    }

    const imgUrl = req.file.location;

    const category = await primaryCategory.create({
      imgUrl,
      ...req.body,
    });
    return res.status(200).json({
      success: true,
      message: "Primary Category created successfully",
      data: category,
    });
  } catch (error) {
    // return res.status(400).json({ success: false, message: error.message });
    let customError = {
      // set default
      statusCode: error.statusCode || 505,
      message: error.message || "Something went wrong try again later",
    };
    if (error.name === "ValidationError") {
      customError.message = Object.values(error.errors)
        .map((item) => item.message)
        .join(",");
      customError.statusCode = 400;
    }

    return res
      .status(customError.statusCode)
      .json({ status: false, message: customError.message });
  }
};

exports.deleteprimaryCategory = async (req, res) => {
  try {
    const { primaryCategoryId } = req.params;
    const check = await primaryCategory.findOne({
      _id: primaryCategoryId,
      permanentDeleted: true,
    });
    if (check) {
      return res
        .status(400)
        .json({ success: false, message: "No Catagory Found" });
    }
    await primaryCategory.findOneAndUpdate(
      { _id: primaryCategoryId },
      {
        permanentDeleted: true,
      },
      {
        new: true,
      }
    );
    await SecondaryCategory.findOneAndUpdate(
      { primaryCategoryId },
      {
        permanentDeleted: true,
      },
      {
        new: true,
      }
    );
    await TertiaryCategory.findOneAndUpdate(
      { primaryCategoryId },
      {
        permanentDeleted: true,
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Main Category deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateprimaryCategory = async (req, res) => {
  try {
    const { primaryCategoryId } = req.params;

    const category = await primaryCategory.findById(primaryCategoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "No Category With Given Id" });
    }
    console.log("/////////////////////////////////////////////\n", req.body);
    const { title, status, New, isNavbar } = req.body;
    if (req.file) {
      const imgUrl = req.file.location;
      const updated = await primaryCategory.findByIdAndUpdate(
        primaryCategoryId,
        { title, status, New, imgUrl, isNavbar },
        { new: true }
      );

      console.log("Updated Primary Category: ", updated);

      return res.status(200).json({
        success: true,
        data: updated,
      });
    } else {
      const updated = await primaryCategory.findByIdAndUpdate(
        primaryCategoryId,
        {
          title,
          status,
          New,
          isNavbar,
        },
        { new: true }
      );
      return res.status(200).json({ success: true, data: updated });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.activeInActiveprimaryCategory = async (req, res) => {
  try {
    const { primaryCategoryId } = req.params;
    const category = await primaryCategory.findById(primaryCategoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "No Category With Given Id" });
    }
    const change = await primaryCategory.findOneAndUpdate(
      { _id: primaryCategoryId, permanentDeleted: false },
      { status: !category.status },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPrimaryById = async (req, res) => {
  try {
    const { primaryCategoryId } = req.params;
    const primary = await primaryCategory.findById(primaryCategoryId);
    if (!primary) {
      return res
        .status(400)
        .json({ success: false, message: "No Primary Category By This Id!" });
    }
    return res.status(200).json({ success: true, data: primary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
