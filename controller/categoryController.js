const Category = require("../models/Category");


// Create Category
exports.createCategory = async (req, res) => {
          try {
                    const { shopId, name, icon } = req.body;
                    console.log(req.body, "kkkk")
                    const check_cat = await Category.find({ shopId, name });
                    if (check_cat.length>0) {
                              return res.json({ success: false, message: "Category already exist" });
                    }
                    const category = await Category.create({ shopId, name, icon });

                    res.json({ success: true, message: "Category created", category });
          } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
          }
};


// Get All Categories of a Shop
exports.getCategories = async (req, res) => {
          try {
                    const { shopId } = req.params;

                    const categories = await Category.find({ shopId });

                    res.json({ success: true, categories });
          } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
          }
};


// Update Category
exports.updateCategory = async (req, res) => {
          try {
                    const { id } = req.params;

                    const category = await Category.findByIdAndUpdate(
                              id,
                              req.body,
                              { new: true }
                    );

                    res.json({ success: true, message: "Category updated", category });
          } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
          }
};


// Delete Category
exports.deleteCategory = async (req, res) => {
          try {
                    const { id } = req.params;

                    await Category.findByIdAndDelete(id);

                    res.json({ success: true, message: "Category deleted" });
          } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
          }
};
