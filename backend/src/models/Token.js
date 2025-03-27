const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },

    dailyTokens: { type: Number, default: 0.0 },
    lockedTokens: { type: Number, default: 0.0 },
    claimableTokens: { type: Number, default: 0.0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
