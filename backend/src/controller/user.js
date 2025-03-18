const express = require("express");
const User = require("../models/User");

const router = express.Router();

// 🟢 Get User Profile

exports.profile = async (req, res) => {
  try {
    console.log(req.user.userId);
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract from token (assuming authMiddleware)
    const { name, email, profileImage } = req.body;

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }), // Update name if provided
          ...(email && { email }), // Update email if provided
          ...(profileImage && { profileImage }) // Update profile image if provided
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }

};
