import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { streamsAPI } from "../../utils/api";

const Chat = ({ streamId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useSocket();
  const { user, isLoggedIn } = useAuth();
  const bottomRef = useRef(null); // for auto-scrolling

  // Load last 50 messages when chat opens
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await streamsAPI.getMessages(streamId);
        setMessages(data.messages);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    loadMessages();
  }, [streamId]);

  // Listen for new messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket || !isLoggedIn) return;

    socket.emit("send-message", { streamId, content: input.trim() });
    setInput("");
  };

  return (
    <div className="glass-card h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <h3 className="text-white text-sm font-medium">Live Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-600 text-xs text-center mt-8">No messages yet. Be the first!</p>
        ) : (
          messages.map((msg, i) => (
            <div key={msg.id || i} className="fade-in">
              <span
                className="text-xs font-medium mr-2"
                style={{ color: msg.username === user?.username ? "#f5f5f5" : "#aaaaaa" }}
              >
                {msg.username}
              </span>
              <span className="text-gray-400 text-xs">{msg.content}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {isLoggedIn ? (
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              className="glass-input text-sm py-2"
              placeholder="Say something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        ) : (
          <p className="text-gray-600 text-xs text-center">
            <a href="/login" className="text-white hover:underline">Sign in</a> to chat
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
