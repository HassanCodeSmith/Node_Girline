const KeepInTouch = require("../models/keepInTouch");
const trimObjects = require("../utils/trimObjects");

/**
 * Handle Keep In Touch
 */
exports.keepInTouch = async (req, res) => {
  try {
    trimObjects(req.body);
    const { email } = req.body;
    const isEmailExist = await KeepInTouch.find({ email });
    if (isEmailExist.length !== 0) {
      console.log(`==> You are already in our touch`);
      return res.status(200).json({
        success: true,
        message: `==> You are already in our touch`,
      });
    }
    await KeepInTouch.create({ email });
    console.log(`==> We will aproach you as soon as possible`);
    return res.status(200).json({
      success: true,
      message: `==> We will aproach you as soon as possible`,
    });
  } catch (error) {
    console.log(`==> ERROR: keepInTouch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: `==> ERROR: keepInTouch - ${error.message}`,
    });
  }
};

/**
 * Handle Get All Keep In Touch
 */
exports.getAllKeepInTouch = async (req, res) => {
  try {
    const getAllKeepInTouchIds = await KeepInTouch.find({});
    if (getAllKeepInTouchIds.length === 0) {
      console.log(`==> There is no any email exists`);
      return res.status(200).json({
        success: true,
        message: `==> There is no any email exists`,
      });
    }
    console.log(`==> KeepInTouchIDs: ${getAllKeepInTouchIds}`);
    return res.status(200).json({
      success: true,
      getAllKeepInTouchIds,
    });
  } catch (error) {
    console.log(`==> ERROR: getAllKeepInTouch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: `==> ERROR: getAllKeepInTouch - ${error.message}`,
    });
  }
};
