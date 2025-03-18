require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db.js");
const authRoutes = require("./src/routes/auth.js");
const userRouter = require("./src/routes/user.js");
const tenantRoutes = require("./src/routes/tenant.js");
const googleRouter = require("./src/routes/googleAuthRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
const authMiddleware = require("./src/middlewares/auth.js"); // Make sure path is correct
const updateLockedTokens = require("./src/cron/updateLockedTokens");

const app = express();

// Connect to MongoDB
connectDB();

// Dynamic CORS Configuration based on environment
const allowedOrigins = [
  "https://rentsback-next-2ccj.vercel.app", // Production frontend
  "http://localhost:3000", // Development frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // Still needed for some auth methods like Google OAuth
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", userRouter);
app.use("/api/auth", authRoutes);
app.use("/api", tenantRoutes);
app.use("/api/gauth", googleRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
