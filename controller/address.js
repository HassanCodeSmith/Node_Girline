const Address = require("../models/address");
const User = require("../models/user");
const { validateEmail } = require("../utils/emailValidator");

exports.addAddress = async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      email,
      country,
      postalCode,
      firstName,
      lastName,
      city,
      address,
      phoneNumber,
    } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "No user Found" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is not valid",
      });
    }

    const check = await Address.find({ userId });
    if (check.length === 0) {
      const addressData = {
        userId,
        email,
        phoneNumber,
        country,
        postalCode,
        firstName,
        lastName,
        city,
        address,
        isDefault: true,
      };
      const data = await Address.create(addressData);
    } else {
      const addressData = {
        userId,
        email,
        phoneNumber,
        country,
        postalCode,
        firstName,
        lastName,
        city,
        address,
      };

      const data = await Address.create(addressData);
    }

    return res
      .status(200)
      .json({ success: true, message: "Address has been saved" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAddressByUser = async (req, res) => {
  try {
    // console.log("================");
    const { userId } = req.user;
    // console.log(req.user);
    const address = await Address.find({ userId });
    return res.status(200).json({ success: true, address });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.setdefault = async (req, res) => {
  try {
    const { userId } = req.user;
    const { addressId } = req.body;
    const check = await Address.findById(addressId);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No Address Found" });
    }

    console.log("=====", userId);
    // Update all addresses of the user except the selected default address
    await Address.updateMany(
      { userId: userId, _id: { $ne: addressId } },
      { isDefault: false }
    );

    const updateddefault = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { isDefault: true },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json({ success: true, updateddefault, message: "Set As Default" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.newsSubscription = async (req, res) => {
  try {
    const { email } = req.body;
    const category = await User.findOne({ email });
    if (!category) {
      return res.status(404).json({ success: false, message: "No email" });
    }
    const change = await User.findOneAndUpdate(
      { _id: primaryCategoryId },
      { status: !category.subscription },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      email,
      addressId,
      country,
      postalCode,
      firstName,
      lastName,
      city,
      address,
      phoneNumber,
    } = req.body;
    // console.log(req.body);
    const check = await Address.findOne({ _id: addressId });
    console.log(check);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No Address Found" });
    }
    await Address.findOneAndUpdate(
      { _id: addressId, userId },
      {
        email,
        phoneNumber,
        country,
        postalCode,
        firstName,
        lastName,
        city,
        address,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ success: true, message: "Updated" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
//
exports.deleteAddress = async (req, res) => {
  try {
    const { userId } = req.user;
    const { addressId } = req.params;
    console.log(userId, addressId);
    const check = await Address.findById(addressId);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No Address Found" });
    }
    await Address.findOneAndRemove({ _id: addressId, userId });
    return res
      .status(200)
      .json({ success: true, message: "Address Has Been Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.webaddAddress = async (req, res) => {
  try {
    const {
      email,
      country,
      postalCode,
      firstName,
      lastName,
      city,
      address,
      phoneNumber,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is not valid",
      });
    }
    const data = await Address.create({
      email,
      phoneNumber,
      country,
      postalCode,
      firstName,
      lastName,
      city,
      address,
    });
    return res
      .status(200)
      .json({ success: true, message: "Address has been saved", data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
// exports.getAddressByUser = async (req, res) => {
//   try {
//     const address = await Address.find({ userId });
//     return res.status(200).json({ success: true, address });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };
