const cron = require("node-cron");
const Token = require("../models/Token");

// Cron job to update lockedTokens every 24 hours
const updateLockedTokens = async () => {
  try {
    console.log("🔄 Running cron job to update lockedTokens...");

    const result = await Token.updateMany({}, [
        {
          $set: {
            lockedTokens: { $add: ["$lockedTokens", { $toDouble: "$dailyTokens" }] }
          }
        }
      ]);

    console.log("✅ lockedTokens updated successfully!");
  } catch (error) {
    console.error("❌ Error updating lockedTokens:", error);
  }
};

// Schedule cron job to run every 24 hours (midnight UTC)
cron.schedule("* * * * *", updateLockedTokens, {
  timezone: "UTC",
});

// Export function if needed elsewhere
module.exports = updateLockedTokens;
