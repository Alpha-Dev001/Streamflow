const Stream = require("../models/Stream");
const Message = require("../models/Message");
const { customAlphabet } = require("nanoid");

const generateKey = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 20);

// ─── GET MY STREAM ────────────────────────────────────────────
// GET /api/streams/me
const getMyStream = async (req, res) => {
  try {
    const stream = await Stream.findOne({ user: req.user._id });

    if (!stream) {
      return res.status(404).json({ message: "You don't have a stream yet." });
    }

    res.json({ stream });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ─── GET ALL LIVE STREAMS ─────────────────────────────────────
// GET /api/streams/live
const getLiveStreams = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { isLive: true };
    if (category) filter.category = category;

    const streams = await Stream.find(filter)
      .sort({ viewerCount: -1 })
      .select("-streamKey"); 

    res.json({ streams });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const getAllStreams = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) filter.category = category;

    const streams = await Stream.find(filter)
      .sort({ isLive: -1, viewerCount: -1 })
      .select("-streamKey");

    res.json({ streams });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};


const getStreamById = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id).select("-streamKey");

    if (!stream) {
      return res.status(404).json({ message: "Stream not found." });
    }

    res.json({ stream });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};


const updateStream = async (req, res) => {
  try {
    const { title, category, thumbnailUrl } = req.body;

    const stream = await Stream.findOne({ user: req.user._id });

    if (!stream) {
      return res.status(404).json({ message: "Stream not found." });
    }

    // Update only provided fields
    if (title) stream.title = title;
    if (category) stream.category = category;
    if (thumbnailUrl) stream.thumbnailUrl = thumbnailUrl;

    await stream.save();

    res.json({ stream });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};


const regenerateKey = async (req, res) => {
  try {
    const stream = await Stream.findOne({ user: req.user._id });

    if (!stream) {
      return res.status(404).json({ message: "Stream not found." });
    }

    if (stream.isLive) {
      return res.status(400).json({ message: "Cannot change key while stream is live." });
    }

    stream.streamKey = generateKey();
    await stream.save();

    res.json({ streamKey: stream.streamKey });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};


const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ stream: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50); // last 50 messages

    res.json({ messages: messages.reverse() }); // oldest first
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getMyStream,
  getLiveStreams,
  getAllStreams,
  getStreamById,
  updateStream,
  regenerateKey,
  getMessages,
};
