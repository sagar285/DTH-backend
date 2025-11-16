// middleware/uploadImages.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
          destination: function (req, file, cb) {
                    cb(null, "uploads/user-images");
          },
          filename: function (req, file, cb) {
                    const uniqueName =
                              Date.now() + "-" + Math.round(Math.random() * 1e9) +
                              path.extname(file.originalname);
                    cb(null, uniqueName);
          },
});

const fileFilter = (req, file, cb) => {
          const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

          if (allowed.includes(file.mimetype)) cb(null, true);
          else cb(new Error("Invalid file type"), false);
};

const uploadImages = multer({
          storage,
          limits: { fileSize: 20 * 1024 * 1024, files: 10 }, // 20MB, 10 images
          fileFilter,
});

module.exports = uploadImages;
