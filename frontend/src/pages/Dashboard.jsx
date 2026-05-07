import { useState, useEffect, useRef } from "react";
import { Eye, Clock, Video, VideoOff, MessageCircle, Monitor, Camera } from "lucide-react";
import { streamsAPI } from "../utils/api";
import useBroadcast from "../hooks/useBroadcast";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import Chat from "../components/stream/Chat";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";

const Dashboard = () => {
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [error, setError] = useState("");
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const videoRef = useRef(null);
  const socket = useSocket();
  const { user, isLoggedIn } = useAuth();
  const { startBroadcast, stopBroadcast, toggleScreenShare } = useBroadcast(stream?._id, videoRef);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const data = await streamsAPI.getMyStream();
        setStream(data.stream);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStream();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("viewer-count", ({ count }) => setViewerCount(count));

    return () => socket.off("viewer-count");
  }, [socket]);

  const handleGoLive = async () => {
    try {
      setError("");
      await startBroadcast();
      setIsLive(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEndStream = () => {
    stopBroadcast();
    setIsLive(false);
    setViewerCount(0);
    setIsScreenSharing(false);
  };

  const handleToggleScreenShare = async () => {
    try {
      await toggleScreenShare();
      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      setError(err.message);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="p-8">
          <div className="mb-8">
            <LoadingSkeleton variant="text" lines={2} className="w-48" />
          </div>
        </div>
        <div className="flex-1 flex gap-6 px-8 pb-8 overflow-hidden" style={{ marginRight: "330px" }}>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            <LoadingSkeleton variant="dashboard" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-semibold">My Stream</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and broadcast your stream</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm text-red-400"
            style={{ background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.2)" }}
          >
            {error}
          </div>
        )}
      </div>

      <div className="flex-1 flex gap-6 px-8" style={{ marginRight: "330px" }}>
        <div className="flex-1 flex flex-col gap-4">
          <div className="glass-card overflow-hidden rounded-lg">
            <div className="relative bg-black" style={{ height: "calc(100vh - 280px)" }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!isLive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    {isScreenSharing ? (
                      <Monitor size={48} className="text-gray-600 mx-auto mb-2" />
                    ) : (
                      <Video size={48} className="text-gray-600 mx-auto mb-2" />
                    )}
                    <p className="text-gray-500 text-sm">
                      {isScreenSharing ? "Screen preview will appear here" : "Camera preview will appear here"}
                    </p>
                  </div>
                </div>
              )}
              {isLive && (
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="live-badge"><span className="live-dot" />LIVE</span>
                  {isScreenSharing && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md flex items-center gap-1">
                      <Monitor size={12} />
                      Screen Share
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex flex-wrap gap-3 items-center">
              {isLive ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500" style={{ boxShadow: "0 0 8px rgba(255,59,59,0.6)" }} />
                    <span className="text-white text-sm font-medium">LIVE</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                    <Eye size={16} className="text-gray-400" />
                    <span className="text-white text-sm">{viewerCount} watching</span>
                  </div>
                  <button
                    onClick={handleToggleScreenShare}
                    className={`btn-ghost text-sm py-2 px-4 ${isScreenSharing
                      ? "text-blue-400 border-blue-400/20 hover:bg-blue-400/10"
                      : "text-gray-400 border-gray-400/20 hover:bg-gray-400/10"
                      }`}
                    title={isScreenSharing ? "Switch to Camera" : "Share Screen"}
                  >
                    {isScreenSharing ? <Camera size={16} /> : <Monitor size={16} />}
                    {isScreenSharing ? "Camera" : "Screen"}
                  </button>
                  <button
                    onClick={handleEndStream}
                    className="ml-auto btn-ghost text-red-400 border-red-400/20 hover:bg-red-400/10 text-sm py-2 px-4"
                  >
                    <VideoOff size={16} />End Stream
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <button onClick={handleGoLive} className="btn-primary flex-1 justify-center py-3">
                    <Video size={18} />Go Live
                  </button>
                  <button
                    onClick={handleToggleScreenShare}
                    className={`btn-ghost px-4 ${isScreenSharing
                      ? "text-blue-400 border-blue-400/20 hover:bg-blue-400/10"
                      : "text-gray-400 border-gray-400/20 hover:bg-gray-400/10"
                      }`}
                    title={isScreenSharing ? "Switch to Camera" : "Share Screen"}
                  >
                    {isScreenSharing ? <Camera size={16} /> : <Monitor size={16} />}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {isLive ? (
          <div className="fixed right-0 top-20 w-80 h-[calc(100vh-80px)] flex flex-col p-4">
            <div className="flex-1 flex flex-col min-h-0 glass-card rounded-lg overflow-hidden">
              <Chat streamId={stream?._id} />
            </div>
          </div>
        ) : (
          <div className="fixed right-0 top-20 w-80 h-[calc(100vh-80px)] flex flex-col p-4">
            <div className="flex-1 flex flex-col items-center justify-center glass-card rounded-lg gap-4">
              <MessageCircle size={48} className="text-gray-600" />
              <div className="text-center">
                <h3 className="text-white font-semibold mb-2">Stream Offline</h3>
                <p className="text-gray-500 text-sm">Start streaming to enable live chat</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
