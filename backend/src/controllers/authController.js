const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Stream = require("../models/Stream");

// Helper: generate a JWT token for a user
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ─── REGISTER ────────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email, and password." });
    }

    // Check if email or username is already taken
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already in use." });

    const usernameExists = await User.findOne({ username });
    if (usernameExists) return res.status(400).json({ message: "Username already taken." });

    // Create the user (password is hashed automatically in the model)
    const user = await User.create({ username, email, password });

    // Automatically create a stream for the new user
    await Stream.create({
      user: user._id,
      title: `${username}'s Stream`,
    });

    // Return user info + token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    // Handle mongoose validation errors nicely
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    // Find user and include password (it's excluded by default)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Logged in successfully!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ─── GET ME ───────────────────────────────────────────────────
// GET /api/auth/me  (requires token)
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        bio: req.user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────
// PATCH /api/auth/me
const updateMe = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;

    // Check if new username is taken by someone else
    if (username && username !== req.user.username) {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ message: "Username already taken." });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, avatar },
      { new: true, runValidators: true }
    );

    res.json({ user: updated });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { register, login, getMe, updateMe };
