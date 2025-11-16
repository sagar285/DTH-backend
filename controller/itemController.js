const Item = require("../models/Item");


// Create Item
exports.createItem = async (req, res) => {
          try {
                    const item = await Item.create(req.body);
                    res.json({ success: true, message: "Item created", item });
          } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
          }
};


// Get All Items of a Category
exports.getItemsByCategory = async (req, res) => {
          try {
                    const { categoryId } = req.params;

                    const items = await Item.find({ categoryId });
                    res.json({ success: true, items });
          } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
          }
};


// Update Item
exports.updateItem = async (req, res) => {
          try {
                    const { id } = req.params;

                    const item = await Item.findByIdAndUpdate(
                              id,
                              req.body,
                              { new: true }
                    );

                    res.json({ success: true, message: "Item updated", item });
          } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
          }
};


// Delete Item
exports.deleteItem = async (req, res) => {
          try {
                    const { id } = req.params;

                    await Item.findByIdAndDelete(id);

                    res.json({ success: true, message: "Item deleted" });
          } catch (error) {
                    res.status(500).json({ success: false, error: error.message });
          }
};
