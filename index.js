const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db"); // database connection
const authRoutes = require("./routes/authRoutes"); // import auth routes
const userRoutes = require("./routes/userRoutes"); // import user routes
const imageRoutes = require("./routes/userImagesRoutes");  // import userimage routes
const shopRoutes = require("./routes/shopRoutes"); //import shop routes
const categoryRoutes = require("./routes/categoryRoutes"); //import category routes
const itemRoutes = require("./routes/itemRoutes"); //import item routes
const shopAccessRoutes = require("./routes/shopAccessRoutes");           // shop access routes
const cartController = require("./routes/cartRoutes");
require("./Scheduler/DB_scheduler");

// Load environment variables


// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Test route
app.get("/", (req, res) => {
          res.send("DTH Backend is running 🚀");
});


//uploads folder public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ✅ Use authentication routes
app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/user/images", imageRoutes);

app.use("/api/vendor/shop", shopRoutes);

app.use("/api/menu/category", categoryRoutes);

app.use("/api/menu/item", itemRoutes);

app.use("/api/shopAccess", shopAccessRoutes);

app.use("/api/cart", cartController);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
