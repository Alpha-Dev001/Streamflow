import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, BarChart3, Users, MessageSquare, Settings, ArrowRight, Eye, Clock, DollarSign, TrendingUp, Activity, Calendar, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { streamsAPI } from "../utils/api";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [topStreams, setTopStreams] = useState([]);
  const [recentStreams, setRecentStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTopStreams = async () => {
      try {
        const response = await fetch('/api/streams');
        const data = await response.json();

        // Sort by totalViews and get top 3
        const sortedStreams = data.streams
          .sort((a, b) => b.totalViews - a.totalViews)
          .slice(0, 3);

        setTopStreams(sortedStreams);
      } catch (error) {
        console.error('Failed to fetch top streams:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentStreams = async () => {
      try {
        const response = await fetch('/api/streams/recent');
        const data = await response.json();
        setRecentStreams(data.streams.slice(0, 3)); // Show 3 recent streams
      } catch (error) {
        console.error('Failed to fetch recent streams:', error);
      }
    };

    fetchTopStreams();
    fetchRecentStreams();

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    {
      icon: Play,
      title: "Go Live",
      description: "Start streaming instantly",
      link: "/app/dashboard"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "View your performance",
      link: "/app/dashboard"
    },
    {
      icon: Settings,
      title: "Stream Settings",
      description: "Configure your stream",
      link: "/app/settings"
    },
    {
      icon: Users,
      title: "Discover",
      description: "Find other streamers",
      link: "/app/discover"
    }
  ];

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
        <div className="glass-card p-6 rounded-xl border border-white/10 mb-8">
          <h2 className="text-xl font-light text-white mb-6">Top Streams</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/10 rounded-lg h-32 mb-4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/5 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topStreams.map((stream, index) => (
                <Link
                  key={stream._id}
                  to={`/watch/${stream._id}`}
                  className="group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="glass-card p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
                    {/* Thumbnail */}
                    <div className="relative mb-4">
                      {stream.thumbnailUrl ? (
                        <img
                          src={stream.thumbnailUrl}
                          alt={stream.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-white/10 rounded-lg flex items-center justify-center">
                          <Play className="w-8 h-8 text-white/40" />
                        </div>
                      )}
                      {stream.isLive && (
                        <div className="absolute top-2 left-2">
                          <span className="live-badge">
                            <span className="live-dot"></span>
                            LIVE
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                        #{index + 1}
                      </div>
                    </div>

                    {/* Stream Info */}
                    <div className="space-y-2">
                      <h3 className="text-white font-medium text-sm truncate">{stream.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {stream.user?.avatar ? (
                            <img
                              src={stream.user.avatar}
                              alt={stream.user.username}
                              className="w-5 h-5 rounded-full"
                            />
                          ) : (
                            <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                          )}
                          <span className="text-white/60 text-xs">{stream.user?.username}</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/60 text-xs">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{stream.totalViews?.toLocaleString() || 0}</span>
                          </div>
                          {stream.isLive && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{stream.viewerCount || 0}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Streams */}
        <div className="glass-card p-6 rounded-xl border border-white/10 mb-8">
          <h2 className="text-xl font-light text-white mb-6">Recent Streams</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/10 rounded-lg h-24 mb-3"></div>
                  <div className="h-3 bg-white/10 rounded mb-2 w-3/4"></div>
                  <div className="h-2 bg-white/5 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentStreams.map((stream, index) => (
                <Link
                  key={stream._id}
                  to={`/watch/${stream._id}`}
                  className="group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="glass-card p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
                    {/* Thumbnail */}
                    <div className="relative mb-3">
                      {stream.thumbnailUrl ? (
                        <img
                          src={stream.thumbnailUrl}
                          alt={stream.title}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-24 bg-white/10 rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white/40" />
                        </div>
                      )}
                      {stream.isLive && (
                        <div className="absolute top-2 left-2">
                          <span className="live-badge">
                            <span className="live-dot"></span>
                            LIVE
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stream Info */}
                    <div className="space-y-1">
                      <h3 className="text-white font-medium text-sm truncate">{stream.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {stream.user?.avatar ? (
                            <img
                              src={stream.user.avatar}
                              alt={stream.user.username}
                              className="w-4 h-4 rounded-full"
                            />
                          ) : (
                            <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                          )}
                          <span className="text-white/60 text-xs">{stream.user?.username}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{stream.totalViews?.toLocaleString() || 0}</span>
                          </div>
                          {stream.isLive && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{stream.viewerCount || 0}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-light text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                to={action.link}
                className="group p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">{action.title}</h3>
                    <p className="text-white/60 text-xs">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
