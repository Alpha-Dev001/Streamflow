import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, ArrowLeft, WifiOff } from "lucide-react";
import { streamsAPI } from "../utils/api";
import useViewer from "../hooks/useViewer";
import Chat from "../components/stream/Chat";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [broadcasterLeft, setBroadcasterLeft] = useState(false);

  const videoRef = useRef(null);
  const socket = useSocket();
  const { joinStream, leaveStream } = useViewer(id, videoRef);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const data = await streamsAPI.getById(id);
        setStream(data.stream);
        setViewerCount(data.stream.viewerCount || 0);
      } catch (err) {
        showError(err.message || "Stream not found");
        navigate("/app/discover");
      } finally {
        setLoading(false);
      }
    };

    fetchStream();

    const interval = setInterval(fetchStream, 5000);
    return () => clearInterval(interval);
  }, [id, navigate, showError]);

  useEffect(() => {
    if (stream && socket) {
      joinStream();
    }

    return () => {
      leaveStream();
    };
  }, [stream, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("viewer-count", ({ count }) => setViewerCount(count));
    socket.on("broadcaster-left", () => {
      setBroadcasterLeft(true);
      streamsAPI.getById(id).then(data => {
        setStream(data.stream);
      });
    });

    return () => {
      socket.off("viewer-count");
      socket.off("broadcaster-left");
    };
  }, [socket, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <LoadingSkeleton variant="text" lines={1} className="w-32 h-6" />
        </div>
        <div className="flex-1 flex gap-0 overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
          <div className="flex-1 flex flex-col">
            <div className="relative bg-black flex-1">
              <LoadingSkeleton className="w-full h-full" />
            </div>
            <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <LoadingSkeleton variant="circle" className="w-10 h-10" />
                  <div className="flex-1">
                    <LoadingSkeleton variant="text" lines={2} className="w-48" />
                  </div>
                </div>
                <LoadingSkeleton variant="text" lines={1} className="w-20 h-8" />
              </div>
            </div>
          </div>
          <div className="w-96 flex-shrink-0 border-l" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <LoadingSkeleton className="h-full p-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white font-medium mb-2">Stream not found</p>
          <button onClick={() => navigate("/")} className="btn-ghost text-sm">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h2 className="text-white font-semibold flex-1 ml-4 truncate">{stream.title}</h2>
      </div>

      <div className="flex-1 flex gap-0 overflow-hidden" style={{ height: "calc(100vh - 60px)" }}>
        <div className="flex-1 flex flex-col">
          <div className="relative bg-black flex-1">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />

            {stream.isLive && !broadcasterLeft && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center opacity-0 animate-pulse">
                  <p className="text-gray-500 text-sm">Connecting to stream...</p>
                </div>
              </div>
            )}

            {(!stream.isLive || broadcasterLeft) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/90">
                <div className="text-center">
                  <WifiOff size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-300 font-medium text-lg">
                    {broadcasterLeft ? "Stream ended" : "Stream is offline"}
                  </p>
                </div>
              </div>
            )}

            {stream.isLive && !broadcasterLeft && (
              <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                <span className="live-badge"><span className="live-dot" />LIVE</span>
                <span className="flex items-center gap-1 text-white text-xs px-3 py-1.5 rounded-md font-medium"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
                >
                  <Eye size={14} />{viewerCount.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                  {stream.user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{stream.user?.username}</p>
                  {stream.user?.bio && (
                    <p className="text-gray-500 text-xs">{stream.user.bio}</p>
                  )}
                </div>
              </div>
              {stream.category && stream.category !== "other" && (
                <span className="px-3 py-1 rounded-full text-xs text-gray-400 capitalize flex-shrink-0"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {stream.category}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-96 flex-shrink-0 border-l" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Chat streamId={id} />
        </div>
      </div>
    </div>
  );
};

export default Watch;
