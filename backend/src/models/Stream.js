const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");

// Generate a safe, unique stream key (uppercase + numbers, 20 chars)
const generateKey = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 20);

const streamSchema = new mongoose.Schema(
  {
    // Who owns this stream
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Stream title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      default: "My Live Stream",
    },

    category: {
      type: String,
      enum: ["gaming", "music", "tech", "sports", "creative", "education", "chat", "other"],
      default: "other",
    },

    // The unique key OBS uses to authenticate
    streamKey: {
      type: String,
      unique: true,
      default: () => generateKey(),
    },

    // Is this stream currently live?
    isLive: {
      type: Boolean,
      default: false,
    },

    // How many people are watching right now
    viewerCount: {
      type: Number,
      default: 0,
    },

    // Total views all time
    totalViews: {
      type: Number,
      default: 0,
    },

    thumbnailUrl: {
      type: String,
      default: null,
    },

    coverPageUrl: {
      type: String,
      default: null,
    },

    // When the current live session started
    startedAt: {
      type: Date,
      default: null,
    },

    // When the last session ended
    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Populate user info automatically when querying streams
streamSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username avatar bio", // only send safe fields
  });
  next();
});

module.exports = mongoose.model("Stream", streamSchema);
