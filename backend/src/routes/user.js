const express = require("express");
const { body } = require("express-validator");
const userController = require("../controller/user");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();
console.log("User router loaded!");

router.put("/user/profile",
    [
      body("name").notEmpty().withMessage("Name is required"),
      body("email").isEmail().withMessage("Invalid email format"),
      body("profileImage")
        .optional()
        .isObject()
        .withMessage("Profile image must be an object")
        .custom((value) => {
          if (!value.url || !value.key) {
            throw new Error("Both url and key are required in profileImage");
          }
          return true;
        }),
    ],
    authMiddleware,
    userController.updateProfile
  );
router.get("/user/profile", authMiddleware, userController.profile);

module.exports = router;
