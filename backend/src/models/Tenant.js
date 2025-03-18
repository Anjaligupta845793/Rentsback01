const mongoose = require("mongoose");

const TenantSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        monthlyRentHOA: { type: Number, default: 0 },
        monthlyRentUSD: { type: Number, default: 0 },
        rentPerDay: { type: Number, default: 0 },
        planPercentage: { type: Number, default: 0 },
        tokensPerDay: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        payableAmount: { type: Number, default: 0 },
        usdPrice: { type: Number, default: 1 }, // Assuming default USD price is 1

        transportationDistance: { type: String, enum: ["Less than 15 min", "15-30 min", "More than 30 min"], default: "Less than 15 min" },
        relocatePreference: { type: String, enum: ["Yes", "No"], default: "No" },
        flatSatisfaction: { type: String, enum: ["Yes", "No"], default: "No" },
        paymentType: { type: String, enum: ["Credit Card", "Debit Card", "Bank Transfer", "Crypto"], default: "Credit Card" },

        termsAccepted: { type: Boolean, default: false },
        privacyConsent: { type: Boolean, default: false },
        receiveOffers: { type: Boolean, default: false },
        complianceStatement: { type: Boolean, default: false },

        fullName: { type: String, default: "" },
        email: { type: String, default: "" },
        phoneNumber: { type: String, default: "" },
        dateOfBirth: { type: Date, default: null },

        residentialAddress: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        country: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tenant", TenantSchema);
