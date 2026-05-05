import { useState, useEffect } from "react";
import { Radio, Satellite } from "lucide-react";
import { streamsAPI } from "../utils/api";
import StreamCard from "../components/stream/StreamCard";

const Home = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const data = await streamsAPI.getLive();
        setStreams(data.streams);
      } catch (err) {
        console.error("Failed to fetch streams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();

    const interval = setInterval(fetchStreams, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Radio size={16} className="text-red-500" />
          <span className="text-red-500 text-xs font-medium uppercase tracking-widest">Live Now</span>
        </div>
        <h1 className="text-white text-2xl font-semibold">Live Streams</h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? "Loading..." : `${streams.length} stream${streams.length !== 1 ? "s" : ""} live right now`}
        </p>
      </div>

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
          <Satellite size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No streams live right now</p>
          <p className="text-gray-500 text-sm">Be the first to go live from your dashboard!</p>
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

export default Home;
