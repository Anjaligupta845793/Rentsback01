const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User"); // Adjust path if needed
const { sendVerificationEmail } = require("../services/emailService");

const JWT_SECRET = process.env.JWT_SECRET;
const blacklist = new Set();


/**
 * Handle user signup
 */
 exports.signup = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "1h" }
    );

    // Create user (unverified)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });


    // Generate verification link
    const verificationUrl = `${process.env.CLIENT_URL}/verify?token=${verificationToken}`;

    // Send verification email via AWS SES
    try {
      // await sendVerificationEmail(email, name, verificationUrl);
      await newUser.save();
      console.log(`Verification email sent to ${verificationToken}`);
    } catch (error) {
      console.error("AWS SES Error:", error);
      return res.status(500).json({ message: "Error sending verification email" });
    }

    res.status(201).json({
      message: "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "1d" } // Adjust expiry as needed
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Add token to the blacklist
    blacklist.add(token);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { email } = decoded;

    // Find user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Mark user as verified and remove verification token
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // Generate JWT token for authentication
    const authToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || "1d" });

    res.status(200).json({
      message: "Email verified successfully",
      token: authToken,
      userId: user._id,
    });
  } catch (error) {
    console.error("Email Verification Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
