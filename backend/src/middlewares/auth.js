const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user ID to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
