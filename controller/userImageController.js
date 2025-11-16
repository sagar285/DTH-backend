const UserImage = require("../models/UserImage");
const { v4: uuidv4 } = require("uuid");
exports.uploadUserImages = async (req, res) => {
          try {
                    if (!req.files || req.files.length === 0)
                              return res.status(400).json({ message: "No images uploaded" });

                    const userId = req.user.id;

                    // Find existing user's image document
                    let userImageDoc = await UserImage.findOne({ user: userId });

                    // If first time uploading → create document
                    if (!userImageDoc) {
                              userImageDoc = new UserImage({
                                        user: userId,
                                        images: []
                              });
                    }

                    // Add each uploaded image to images array
                    req.files.forEach((file) => {
                              userImageDoc.images.push({
                                        imageId: uuidv4(),       // Unique id
                                        imageUrl: file.path,
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                              });
                    });

                    await userImageDoc.save();

                    res.json({
                              message: "Images uploaded successfully",
                              data: "total image uploaded " + userImageDoc.images.length
                    });

          } catch (error) {
                    res.status(500).json({ message: error.message });
          }
};


exports.updateUserImage = async (req, res) => {
          try {
                    const userId = req.user.id;
                    const { imageId } = req.params;
                    console.log(imageId)
                    if (!req.file)
                              return res.status(400).json({ message: "No new image uploaded" });

                    // Find user image document
                    let userImageDoc = await UserImage.findOne({ user: userId });

                    if (!userImageDoc)
                              return res.status(404).json({ message: "No image record found" });

                    // Find image index
                    const imageIndex = userImageDoc.images.findIndex(img => img.imageId === imageId);

                    if (imageIndex === -1)
                              return res.status(404).json({ message: "Image not found" });

                    // Update image details
                    userImageDoc.images[imageIndex].imageUrl = req.file.path;
                    userImageDoc.images[imageIndex].updatedAt = new Date();

                    await userImageDoc.save();

                    res.json({
                              message: "Image updated successfully",
                    });

          } catch (error) {
                    res.status(500).json({ message: error.message });
          }
};


exports.deleteUserImage = async (req, res) => {
          try {
                    const userId = req.user.id;
                    const { imageId } = req.params;

                    let userImageDoc = await UserImage.findOne({ user: userId });

                    if (!userImageDoc)
                              return res.status(404).json({ message: "No image record found" });

                    // Filter out the image
                    const newImages = userImageDoc.images.filter(img => img.imageId !== imageId);

                    if (newImages.length === userImageDoc.images.length)
                              return res.status(404).json({ message: "Image not found" });

                    userImageDoc.images = newImages;

                    await userImageDoc.save();

                    res.json({
                              message: "Image deleted successfully",
                              data: userImageDoc
                    });

          } catch (error) {
                    res.status(500).json({ message: error.message });
          }
};
