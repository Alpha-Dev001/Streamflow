const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware that checks if the user is logged in
const protect = async (req, res, next) => {
  try {
    // 1. Check if Authorization header exists and has a Bearer token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized. Please log in." });
    }

    // 2. Extract the token
    const token = authHeader.split(" ")[1];

    // 3. Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user this token belongs to
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    // 5. Attach user to the request so routes can use it
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    res.status(500).json({ message: "Server error during authentication." });
  }
};

module.exports = { protect };
