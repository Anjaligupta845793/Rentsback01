const express = require("express");
const { body } = require("express-validator");
const authController = require("../controller/auth");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// Signup
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  authController.signup
);

// Login
router.post("/login", authController.login);

// ✅ Email Verification Route
router.post("/verify", authController.verifyEmail);

router.post("/logout", authController.logout);

// Protected Profile Route
router.get("/profile", authMiddleware, async (req, res) => {
  res.json({ message: `Welcome, user ID: ${req.user.userId}` });
});

/* router.post("/blockpass/webhook", authController.blockpass);
router.get("/kyc-status/:userId", authController.kycstatus); */

module.exports = router;
