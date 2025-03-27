const mongoose = require("mongoose");

const TenantSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },

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
        paymentType: { type: String, enum: ["Credit Card", "Debit Card", "Bank Transfer", "Crypto", "Metamask"], default: "Metamask" },

        termsAccepted: { type: Boolean, default: false },
        privacyConsent: { type: Boolean, default: false },
        receiveOffers: { type: Boolean, default: false },
        complianceStatement: { type: Boolean, default: false },
        terminate: { type: Boolean, default: false },

        // Rental Contract Dates
        rentalStartDate: { type: Date, required: true },
        rentalClosureDate: { type: Date, required: true },

        // Smart Contract Dates
        smartContractStartDate: { type: Date, required: true },
        smartContractEndDate: { type: Date, required: true },
        smartContractDurationInDays: { type: Number, required: true },

        email: { type: String, default: "" },
        phoneNumber: { type: String, default: "" },
        dateOfBirth: { type: Date, default: null },

        residentialAddress: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        country: { type: String, default: "" },

        isForm2: { type: Boolean, default: false }, // New field added
        // Newly Added Fields with default values
        apartmentOrHouse: { type: String, enum: ["Apartment", "House"], default: "Apartment" },
        completeAddress: { type: String, default: "" },
        apartmentLevel: { type: String, default: "" },
        numberOfRooms: { type: String, default: "" },
        roomsOver40m2: { type: String, default: "" },
        yearOfConstruction: { type: String, default: "" },
        furnishedUnit: { type: Boolean, default: false },
        workFromHome: { type: Boolean, default: false },
        workPurpose: { type: Boolean, default: false },
        tenantWalletAddress: { type: String, default: "" },
        equipment: { type: [String], default: [] },

        // File Upload Fields
        rentalContractFile: { type: String, default: "" }, // PDF File URL/Path
        idVerificationFile: { type: String, default: "" }, // JPEG/PNG/PDF File URL/Path
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tenant", TenantSchema);
