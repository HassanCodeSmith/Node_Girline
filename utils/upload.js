const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
//     );
//   },
// });

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_ID, // store it in .env file to keep it safe
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
  },
  region: process.env.AWS_S3_REGION, // this is the region that you select in AWS account
});

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: process.env.AWS_S3_BUCKET_NAME, // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName =
      Date.now() + "_" + file.fieldname + "_" + file.originalname;
    cb(null, fileName);
  },
});

// old code
// const fileFilter = (req, file, cb) => {
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. For images, PNG, JPG, JPEG are allowed."));
//   }
// };
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Instead of crashing the server, send an error response to the client
    const error = new Error(
      "Invalid file type. For images, PNG, JPG, JPEG are allowed."
    );
    error.status = 400; // Set a status code for the client to handle
    cb(error);
  }
};

const upload = multer({ storage: s3Storage, fileFilter });

module.exports = { upload };
