import { useState, useEffect } from "react";
import { Compass, Search } from "lucide-react";
import { streamsAPI } from "../utils/api";
import StreamCard from "../components/stream/StreamCard";

const CATEGORIES = ["all", "gaming", "music", "tech", "sports", "creative", "education", "chat", "other"];

const Discover = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchStreams = async () => {
      setLoading(true);
      try {
        const data = await streamsAPI.getAll(
          activeCategory !== "all" ? activeCategory : null
        );
        setStreams(data.streams);
      } catch (err) {
        console.error("Failed to fetch streams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [activeCategory]);

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Compass size={16} className="text-gray-400" />
          <span className="text-gray-400 text-xs uppercase tracking-widest">Browse</span>
        </div>
        <h1 className="text-white text-2xl font-semibold">Discover</h1>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition-all duration-200 ${activeCategory === cat
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            style={activeCategory !== cat ? { border: "1px solid rgba(255,255,255,0.08)" } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <div className="aspect-video bg-white/5 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-white/5 rounded animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : streams.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Search size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No streams found</p>
          <p className="text-gray-500 text-sm">Try a different category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {streams.map((stream) => (
            <StreamCard key={stream._id} stream={stream} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;
