import { useState, useEffect } from "react";
import { Compass, Search, Filter, Clock, TrendingUp, Users } from "lucide-react";
import { streamsAPI } from "../utils/api";
import { useToast } from "../context/ToastContext";
import StreamCard from "../components/stream/StreamCard";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";

const CATEGORIES = ["all", "gaming", "music", "tech", "sports", "creative", "education", "chat", "other"];
const SORT_OPTIONS = [
  { value: "recent", label: "Recent", icon: Clock },
  { value: "popular", label: "Popular", icon: TrendingUp },
  { value: "live", label: "Live", icon: Users },
];

const Discover = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const { error: showError } = useToast();

  useEffect(() => {
    const fetchStreams = async () => {
      setLoading(true);
      try {
        let data;
        const category = activeCategory !== "all" ? activeCategory : null;

        switch (sortBy) {
          case "recent":
            data = await streamsAPI.getRecent(category);
            break;
          case "live":
            data = await streamsAPI.getLive(category);
            break;
          case "popular":
          default:
            data = await streamsAPI.getAll(category);
            break;
        }

        setStreams(data.streams);
      } catch (err) {
        showError(err.message || "Failed to fetch streams");
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [activeCategory, sortBy, showError]);

  return (
    <div className="flex gap-6 p-8 fade-in" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Main Content */}
      <main className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Fixed Header */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Compass size={16} className="text-gray-400" />
            <span className="text-gray-400 text-xs uppercase tracking-widest">Browse</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-semibold">
              {activeCategory === "all" ? "Discover" : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Streams`}
            </h1>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs uppercase tracking-widest mr-2">Sort by</span>
              <div className="flex gap-1">
                {SORT_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${sortBy === option.value
                        ? "bg-white text-black"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      style={sortBy !== option.value ? { border: "1px solid rgba(255,255,255,0.08)" } : {}}
                    >
                      <Icon size={14} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" style={{ overflow: 'hidden' }}>
              {[...Array(6)].map((_, i) => (
                <LoadingSkeleton key={i} variant="stream" />
              ))}
            </div>
          ) : streams.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <Search size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                {activeCategory === "all"
                  ? `No ${sortBy} streams found`
                  : `No ${sortBy} ${activeCategory} streams found`}
              </p>
              <p className="text-gray-500 text-sm">
                Try a different category or sort option
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
              {streams.map((stream) => (
                <StreamCard key={stream._id} stream={stream} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Category Sidebar - Fixed */}
      <aside className="w-64 flex-shrink-0 overflow-hidden">
        <div className="glass-card p-6 h-full">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-gray-400" />
            <span className="text-gray-400 text-xs uppercase tracking-widest">Categories</span>
          </div>
          <h3 className="text-white font-semibold mb-4">Filter by Category</h3>

          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${activeCategory === cat
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                style={activeCategory !== cat ? { border: "1px solid rgba(255,255,255,0.08)" } : {}}
              >
                {cat === "all" ? "All Streams" : cat}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Discover;
