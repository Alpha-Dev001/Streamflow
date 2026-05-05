const Stream = require("../models/Stream");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          socket.user = user;
        }
      }
    } catch (err) {
    }
    next();
  });

  const rooms = new Map();
  const connectionMetrics = new Map();

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Track connection metrics
    connectionMetrics.set(socket.id, {
      connectedAt: Date.now(),
      lastActivity: Date.now(),
      packetsSent: 0,
      packetsReceived: 0,
      latency: 0
    });

    socket.on("join-stream", async ({ streamId, role }) => {
      socket.join(streamId);
      socket.streamId = streamId;
      socket.role = role;

      if (!rooms.has(streamId)) rooms.set(streamId, new Set());
      rooms.get(streamId).add(socket.id);

      console.log(`📺 ${role} ${socket.id} joined stream ${streamId}`);

      if (role === "broadcaster") {
        await Stream.findByIdAndUpdate(streamId, {
          isLive: true,
          startedAt: new Date(),
          endedAt: null,
        });

        socket.to(streamId).emit("broadcaster-joined", { broadcasterId: socket.id });
      }

      if (role === "viewer") {
        const viewerCount = rooms.get(streamId)?.size - 1 || 0;
        await Stream.findByIdAndUpdate(streamId, {
          viewerCount: Math.max(0, viewerCount),
          $inc: { totalViews: 1 },
        });

        socket.to(streamId).emit("viewer-joined", { viewerId: socket.id });

        io.to(streamId).emit("viewer-count", { count: viewerCount });
      }
    });

    socket.on("webrtc-offer", ({ offer, viewerId }) => {
      console.log(`📡 Offer from broadcaster to viewer ${viewerId}`);
      // Optimize offer transmission
      const optimizedOffer = {
        ...offer,
        sdp: offer.sdp.replace(/a=fmtp:96 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\n/g,
          'a=fmtp:96 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\n')
      };

      io.to(viewerId).emit("webrtc-offer", {
        offer: optimizedOffer,
        broadcasterId: socket.id,
      });
    });

    socket.on("webrtc-answer", ({ answer, broadcasterId }) => {
      console.log(`📡 Answer from viewer to broadcaster ${broadcasterId}`);
      io.to(broadcasterId).emit("webrtc-answer", {
        answer,
        viewerId: socket.id,
      });
    });

    socket.on("ice-candidate", ({ candidate, targetId }) => {
      io.to(targetId).emit("ice-candidate", {
        candidate,
        fromId: socket.id,
      });
    });

    socket.on("send-message", async ({ streamId, content }) => {
      if (!socket.user) {
        return socket.emit("error", { message: "Must be logged in to chat." });
      }

      if (!content || content.trim().length === 0) return;
      if (content.length > 500) return;

      try {
        const message = await Message.create({
          stream: streamId,
          user: socket.user._id,
          username: socket.user.username,
          content: content.trim(),
        });

        io.to(streamId).emit("new-message", {
          id: message._id,
          username: socket.user.username,
          content: message.content,
          createdAt: message.createdAt,
        });
      } catch (error) {
        console.error("Message error:", error);
      }
    });

    socket.on("ping", () => {
      const metrics = connectionMetrics.get(socket.id);
      if (metrics) {
        metrics.lastActivity = Date.now();
        socket.emit("pong", { timestamp: Date.now() });
      }
    });

    socket.on("disconnect", async () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
      connectionMetrics.delete(socket.id);

      const { streamId, role } = socket;
      if (!streamId) return;

      if (rooms.has(streamId)) {
        rooms.get(streamId).delete(socket.id);

        if (rooms.get(streamId).size === 0) {
          rooms.delete(streamId);
        }
      }

      if (role === "broadcaster") {
        await Stream.findByIdAndUpdate(streamId, {
          isLive: false,
          endedAt: new Date(),
          viewerCount: 0,
        });

        socket.to(streamId).emit("broadcaster-left");
        console.log(`📴 Stream ${streamId} went offline`);
      }

      if (role === "viewer") {
        const viewerCount = Math.max(0, (rooms.get(streamId)?.size || 1) - 1);
        await Stream.findByIdAndUpdate(streamId, { viewerCount });

        socket.to(streamId).emit("viewer-left", { viewerId: socket.id });

        io.to(streamId).emit("viewer-count", { count: viewerCount });
      }
    });
  });
};

module.exports = setupSocket;
