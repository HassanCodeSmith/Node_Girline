const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },

    message: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "ContactUs",
  }
);

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = { ContactUs };
