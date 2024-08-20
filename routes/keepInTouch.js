const keepIntouchRouter = require("express").Router();

const { keepInTouch, getAllKeepInTouch } = require("../controller/keepInTouch");

keepIntouchRouter.route("/keepInTouch").post(keepInTouch);

keepIntouchRouter.route("/getAllKeepInTouch").get(getAllKeepInTouch);

module.exports = keepIntouchRouter;
