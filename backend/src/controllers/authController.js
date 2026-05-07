const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const Stream = require("../models/Stream");


const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};


const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email, and password." });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already in use." });

    const usernameExists = await User.findOne({ username });
    if (usernameExists) return res.status(400).json({ message: "Username already taken." });

    const user = await User.create({ username, email, password });

    await Stream.create({
      user: user._id,
      title: `${username}'s Stream`,
    });

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
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

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


const getMe = async (req, res) => {
  try {
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


const updateMe = async (req, res) => {
  try {
    const { username, email, password, bio, avatar } = req.body;

    // Check if username is already taken
    if (username && username !== req.user.username) {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ message: "Username already taken." });
    }

    // Check if email is already taken
    if (email && email !== req.user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already in use." });
    }

    const updateData = { username, email, bio, avatar };

    // Only include password in update if it's provided
    if (password) {
      updateData.password = password;
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    // Return user without password
    const userResponse = {
      id: updated._id,
      username: updated.username,
      email: updated.email,
      avatar: updated.avatar,
      bio: updated.bio,
    };

    res.json({ user: userResponse });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { register, login, getMe, updateMe };
