import { useNavigate } from "react-router-dom";
import { Eye, Tag, Tv } from "lucide-react";

const StreamCard = ({ stream }) => {
  const navigate = useNavigate();

  return (
    <div
      className="glass-card cursor-pointer transition-all duration-200 overflow-hidden group"
      onClick={() => navigate(`/watch/${stream._id}`)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-white/5 overflow-hidden">
        {stream.thumbnailUrl ? (
          <img
            src={stream.thumbnailUrl}
            alt={stream.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // Placeholder gradient when no thumbnail
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)" }}
          >
            <Tv size={48} className="text-gray-600 opacity-20" />
          </div>
        )}

        {/* LIVE badge - top left */}
        {stream.isLive && (
          <div className="absolute top-3 left-3">
            <span className="live-badge">
              <span className="live-dot" />
              LIVE
            </span>
          </div>
        )}

        {/* Viewer count - top right */}
        {stream.isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md text-xs text-white"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          >
            <Eye size={12} />
            {stream.viewerCount || 0}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Streamer avatar */}
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
            {stream.user?.username?.[0]?.toUpperCase() || "?"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{stream.title}</p>
            <p className="text-gray-500 text-xs mt-0.5">{stream.user?.username}</p>

            {/* Category tag */}
            {stream.category && stream.category !== "other" && (
              <div className="flex items-center gap-1 mt-2">
                <Tag size={10} className="text-gray-600" />
                <span className="text-gray-600 text-xs capitalize">{stream.category}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
