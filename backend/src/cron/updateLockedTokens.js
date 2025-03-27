const cron = require("node-cron");
const Token = require("../models/Token");
const Tenant = require("../models/Tenant");

// Cron job to update lockedTokens every 24 hours
const updateLockedTokens = async () => {
  try {
    console.log("🔄 Running cron job to update lockedTokens...");

    const result = await Token.updateMany(
      { tenantId: { $in: await Tenant.find({ terminate: false }).distinct("_id") } }, // Update only if tenant is active
      [
        {
          $set: {
            lockedTokens: { $add: ["$lockedTokens", { $toDouble: "$dailyTokens" }] }
          }
        }
      ]
    );

    console.log(`✅ lockedTokens updated for ${result.modifiedCount} tokens!`);
  } catch (error) {
    console.error("❌ Error updating lockedTokens:", error);
  }
};

// Schedule cron job to run every 24 hours (midnight UTC)
cron.schedule("0 0 * * *", updateLockedTokens, {
  timezone: "UTC",
});

// Export function if needed elsewhere
module.exports = updateLockedTokens;

