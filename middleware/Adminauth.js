const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const { userId } = req.user;

    // console.log(userId);

    const user = await User.findById(userId);

    if (user.role === "admin") {
      req.role = user.role;
      next();
      return;
    }
    if (user.role === "sub-admin") {
      req.role = user.role;
      req.userPermission = user.permission;
      next();
      return;
    }
    return res
      .statue(400)
      .json({ success: false, message: "Authentication Invalid" });
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: "Authentication Invalid" });
  }
};

module.exports = adminAuth;
