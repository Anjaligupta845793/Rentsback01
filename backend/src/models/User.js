const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },

    // 🟢 Add Balance Field
    balance: {
      type: Number,
      default: 0.0, // Default balance 0.0
    },

    profileImage: {
      url: {
        type: String, // AWS S3 URL
        default: "", // Default is empty
      },
      key: {
        type: String, // S3 Object Key (helps with deletion)
        default: "",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
