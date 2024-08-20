/** __________ Express Router Instance __________ */
const router = require("express").Router();

/** __________ Middlewares __________ */
const loginAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/Adminauth");

/** __________ Controllers __________ */
const { createContactUs, getAllContactUs } = require("../controller/contactUs");

/** Create */
router.route("/contactUs/create").post(createContactUs);

/** Get All */
router.route("/contactUs/getAll").get(loginAuth, adminAuth, getAllContactUs);

module.exports = router;
