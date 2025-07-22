const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET,
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

function sanitizeFile(file, cb) {
  const allowedExts = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".mp4",
    ".mkv",
    ".avi",
    ".svg",
  ];
  const isAllowedExt = allowedExts.includes(
    path.extname(file.originalname.toLowerCase())
  );
  const isVideoMimeType = file.mimetype.startsWith("video/");
  const isImageMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && (isVideoMimeType || isImageMimeType)) {
    return cb(null, true);
  } else {
    return cb(new Error("Error: File type not allowed!"), false);
  }
}

// Multer upload configuration
const uploadImage = multer({
  storage: s3Storage,

  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 2, 
  },
  onError: (err, next) => {
    console.error("File upload error: ", err);
    next(err);
  },
}).array("image", 10);


const uploadSingleImage = multer({
  storage: s3Storage,
  fileFilter: (_, file, cb) => {
    sanitizeFile(file, (err, passed) => {
      if (err) {
        console.error("File upload error:", err.message);
        return cb(err, false); 
      }
      cb(null, true); 
    });
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
}).single("image");


module.exports = { uploadImage, uploadSingleImage };
