const multer = require("multer");
const path = require("path");

// -------------------- STORAGE --------------------
const storage = multer.diskStorage({
     
          destination: function (req, file, cb) {
                    cb(null, "uploads/shop-images");
          },
          filename: function (req, file, cb) {
                    const uniqueName =
                              Date.now() +
                              "-" +
                              Math.round(Math.random() * 1e9) +
                              path.extname(file.originalname);
                    cb(null, uniqueName);
          },
});

// -------------------- FILE FILTER --------------------
const fileFilter = (req, file, cb) => {
          const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

          if (allowed.includes(file.mimetype)) {
                    cb(null, true);
          } else {
                    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
          }
};

// -------------------- FINAL UPLOAD CONFIG --------------------
const uploadShopImages = multer({
          storage,
          limits: {
                    fileSize: 20 * 1024 * 1024, // 20MB
          },
          fileFilter,
});

module.exports = uploadShopImages;
