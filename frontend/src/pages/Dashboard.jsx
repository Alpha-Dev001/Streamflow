import { useState, useEffect, useRef } from "react";
import { Copy, RefreshCw, Eye, Clock, Video, VideoOff, Check, MessageCircle, Monitor, Camera } from "lucide-react";
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
  const [copiedKey, setCopiedKey] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [saving, setSaving] = useState(false);
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
        setEditTitle(data.stream.title);
        setEditCategory(data.stream.category);
        setEditThumbnailUrl(data.stream.thumbnailUrl || "");
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

  const copyKey = () => {
    navigator.clipboard.writeText(stream.streamKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = async () => {
    if (!confirm("This will invalidate your current stream key. Continue?")) return;
    try {
      const data = await streamsAPI.regenerateKey();
      setStream({ ...stream, streamKey: data.streamKey });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await streamsAPI.updateMyStream({ title: editTitle, category: editCategory, thumbnailUrl: editThumbnailUrl });
      setStream(data.stream);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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

      <div className="flex-1 flex gap-6 px-8 pb-8 overflow-hidden" style={{ marginRight: "330px" }}>
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          <div className="glass-card overflow-hidden rounded-lg">
            <div className="relative bg-black" style={{ height: "450px" }}>
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

          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">Stream Settings</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Cover Photo Section */}
              <div className="lg:col-span-2">
                <label className="text-gray-400 text-xs mb-2 block font-medium">Cover Photo</label>
                <div className="flex gap-2">
                  <input
                    className="glass-input flex-1"
                    value={editThumbnailUrl}
                    onChange={(e) => setEditThumbnailUrl(e.target.value)}
                    placeholder="Enter cover photo URL..."
                    type="url"
                  />
                  {editThumbnailUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditThumbnailUrl("")}
                        className="btn-ghost px-3 text-gray-400 hover:text-white"
                        title="Clear cover photo"
                      >
                        ✕
                      </button>
                      {stream?.thumbnailUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditThumbnailUrl("");
                            // Also clear the actual stream thumbnail
                            handleSave();
                          }}
                          className="btn-ghost px-3 text-red-400 hover:text-red-300"
                          title="Remove cover photo"
                        >
                          🗑
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail Preview - Now in grid */}
              <div>
                <label className="text-gray-400 text-xs mb-2 block font-medium">Preview</label>
                {editThumbnailUrl ? (
                  <div className="relative aspect-video bg-black/20 rounded-lg overflow-hidden">
                    <img
                      src={editThumbnailUrl}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500" style={{ display: 'none' }}>
                      <p className="text-sm">Failed to load image</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600 text-sm">No cover photo</p>
                  </div>
                )}
              </div>

              {/* Stream Title */}
              <div>
                <label className="text-gray-400 text-xs mb-2 block font-medium">Stream Title</label>
                <input
                  className="glass-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="What are you streaming today?"
                  maxLength={100}
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-gray-400 text-xs mb-2 block font-medium">Category</label>
                <select
                  className="glass-input"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  {["gaming", "music", "tech", "sports", "creative", "education", "chat", "other"].map((c) => (
                    <option key={c} value={c} style={{ background: "#111" }}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stream Key - Full width */}
              <div className="lg:col-span-2">
                <label className="text-gray-400 text-xs mb-2 block font-medium">Stream Key</label>
                <div className="flex gap-2">
                  <input
                    className="glass-input font-mono text-sm"
                    type="password"
                    value={stream?.streamKey || ""}
                    readOnly
                  />
                  <button onClick={copyKey} className="btn-ghost px-3 flex-shrink-0" title="Copy key">
                    {copiedKey ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                  <button onClick={handleRegenerateKey} className="btn-ghost px-3 flex-shrink-0" title="Regenerate key">
                    <RefreshCw size={16} />
                  </button>
                </div>
                <p className="text-gray-600 text-xs mt-2">Keep this private. Use with OBS or Streamlabs.</p>
              </div>

              {/* Save Button - Full width */}
              <div className="lg:col-span-2">
                <button onClick={handleSave} className="btn-primary w-full" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Eye size={18} className="text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">{viewerCount}</p>
              <p className="text-gray-500 text-xs text-center">Watching</p>
            </div>

            <div className="glass-card p-4 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Clock size={18} className="text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stream?.totalViews || 0}</p>
              <p className="text-gray-500 text-xs text-center">Total Views</p>
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
