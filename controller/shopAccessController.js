const Item = require("../models/Item");
const Category = require("../models/Category");

exports.getShopMenu = async (req, res) => {
    try {
        const { shopId } = req.params;

        // Filters from frontend
        const { 
            search = "",          // item name search
            type = "all",         // veg / nonveg / all
            category = "",        // filter by category ID
            page = 1              // pagination
        } = req.query;

        const limit = 3;
        const skip = (page - 1) * limit;

        // ------------------------------
        // BUILD QUERY CONDITIONS
        // ------------------------------
        const query = { shopId };

        // 1️⃣ Search filter
        if (search.trim() !== "") {
            query.name = { $regex: search, $options: "i" };
        }

        // 2️⃣ Veg / nonveg filter  ✔ FIXED
        // Your schema has: type: "veg" | "nonveg"
        if (type !== "all") {
            query.type = type.toLowerCase();   // correct field
        }

        // 3️⃣ Category filter
        if (category) query.categoryId = category;

        // ---------------------------------------
        // Fetch items with pagination
        // ---------------------------------------
        const items = await Item.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Count total items
        const totalItems = await Item.countDocuments(query);

        // ---------------------------------------
        // Get all categories for this shop
        // ---------------------------------------
        const categories = await Category.find({ shopId });

        return res.status(200).json({
            success: true,
            categories,
            items,
            pagination: {
                page: Number(page),
                totalItems,
                totalPages: Math.ceil(totalItems / limit)
            }
        });

    } catch (error) {
        console.log("Error in shop menu:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
