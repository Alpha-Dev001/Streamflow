const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Which stream this message belongs to
    stream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
      required: true,
    },

    // Who sent the message
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: [true, "Message cannot be empty"],
      maxlength: [500, "Message cannot exceed 500 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
