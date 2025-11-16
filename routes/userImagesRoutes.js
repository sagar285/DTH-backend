const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const uploadImages = require("../middleware/uploadImages");

const {
          uploadUserImages,
          updateUserImage,
          deleteUserImage,
} = require("../controller/userImageController");

// Upload multiple images (max 10)
router.post("/upload", protect, uploadImages.array("images", 10), uploadUserImages);

// Update single image
router.put("/update/:imageId", protect, uploadImages.single("image"), updateUserImage);

// Delete image
router.delete("/delete/:imageId", protect, deleteUserImage);

module.exports = router;
