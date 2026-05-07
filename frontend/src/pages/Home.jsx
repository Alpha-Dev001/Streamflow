import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Clock, DollarSign, TrendingUp, Activity, Calendar, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { streamsAPI } from "../utils/api";
import StreamCard from "../components/stream/StreamCard";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [topStreams, setTopStreams] = useState([]);
  const [recentStreams, setRecentStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { error: showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch top streams (all streams sorted by popularity)
        const topStreamsData = await streamsAPI.getAll();
        // Sort by totalViews and get top 3, excluding user's own stream
        const sortedStreams = topStreamsData.streams
          .filter(stream => stream.user._id !== user?.id)
          .sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))
          .slice(0, 3);
        setTopStreams(sortedStreams);

        // Fetch recent streams
        const recentStreamsData = await streamsAPI.getRecent();
        // Filter out user's own stream and show 3 recent streams
        const filteredRecentStreams = recentStreamsData.streams
          .filter(stream => stream.user._id !== user?.id)
          .slice(0, 3);
        setRecentStreams(filteredRecentStreams);
      } catch (error) {
        showError(error.message || 'Failed to fetch streams');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [showError]);


  return (
    <div className="p-8 min-h-screen">
      <div className={`max-w-7xl mx-auto transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-white mb-2">
            Welcome back, {user?.username || 'Streamer'}.
          </h1>
          <p className="text-white/60 text-lg">
            Here's your streaming overview for today.
          </p>
        </div>


        {/* Top Streams */}
        <div className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Top Streams</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} variant="stream" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {topStreams.map((stream, index) => (
                <StreamCard key={stream._id} stream={stream} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Streams */}
        <div className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Recent Streams</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} variant="stream" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {recentStreams.map((stream, index) => (
                <StreamCard key={stream._id} stream={stream} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
