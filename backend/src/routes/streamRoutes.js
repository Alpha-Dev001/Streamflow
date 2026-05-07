const express = require("express");
const router = express.Router();
const {
  getMyStream,
  getLiveStreams,
  getAllStreams,
  getRecentStreams,
  getStreamById,
  updateStream,
  regenerateKey,
  getMessages,
} = require("../controllers/streamController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getAllStreams);
router.get("/live", getLiveStreams);
router.get("/recent", getRecentStreams);
router.get("/:id", getStreamById);
router.get("/:id/messages", getMessages);

// Protected routes
router.get("/user/me", protect, getMyStream);
router.patch("/user/me", protect, updateStream);
router.post("/user/me/regenerate-key", protect, regenerateKey);

module.exports = router;
