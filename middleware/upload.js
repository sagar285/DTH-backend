const multer = require("multer");
const path = require("path");

// Configure where and how files are stored
const storage = multer.diskStorage({
          destination: function (req, file, cb) {
                    cb(null, "uploads/menu_images"); // store inside /uploads folder
          },
          filename: function (req, file, cb) {
                    const uniqueName = `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
                    cb(null, uniqueName);
          }
});

const upload = multer({
          storage,
          limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
          fileFilter: (req, file, cb) => {
                    const allowed = /jpeg|jpg|png/;
                    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
                    const mime = allowed.test(file.mimetype);
                    if (ext && mime) cb(null, true);
                    else cb(new Error("Only JPG, JPEG, PNG files are allowed"));
          }
});

module.exports = upload;
