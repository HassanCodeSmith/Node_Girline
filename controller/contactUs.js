const { ContactUs } = require("../models/contactUs");

const { validateEmail } = require("../utils/emailValidator");
const trimObjects = require("../utils/trimObjects");

/** Create */
exports.createContactUs = async (req, res) => {
  try {
    trimObjects(req.body);
    let { name, email, message } = req.body;
    email = email.toLowerCase();

    if (!(name && email && message)) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    await ContactUs.create({
      name,
      email,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.log("An error occurred while creating contact us: ", error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

/** Get All */
exports.getAllContactUs = async (req, res) => {
  try {
    const data = await ContactUs.find({});
    if (data.length === 0) {
      console.log("Contact Us collection is empty");
      return res.status(400).json({
        success: false,
        message: "Contact Us collection is empty",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact Us collection fetched successfully.",
      data,
    });
  } catch (error) {
    console.log("An error occurred while geting contact us: ", error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
