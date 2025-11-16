const cron = require("node-cron");
const User = require("../models/User"); // update path

// Runs every 24 hours at midnight
cron.schedule("0 0 * * *", async () => {
    try {
        console.log("Running cleanup for users without password...");

        // Find users where password does not exist OR is empty
        const deleted = await User.deleteMany({
            $or: [
                { password: { $exists: false } },
                { password: "" },
                { password: null }
            ]
        });

        console.log(`Deleted users count: ${deleted.deletedCount}`);
    } catch (err) {
        console.error("Error in scheduled cleanup:", err.message);
    }
});
