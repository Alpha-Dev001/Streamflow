import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, BarChart3, Users, MessageSquare, Settings, ArrowRight } from "lucide-react";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
    },
    {
      icon: MessageSquare,
      title: "Chat AI",
      description: "AI-powered assistance",
      link: "/app/chat-ai"
    }
  ];

  return (
    <div className="p-8 min-h-screen">
      <div className={`max-w-4xl mx-auto transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Welcome Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-thin text-white mb-4">
            Welcome back.
          </h1>
          <p className="text-white/60 text-lg">
            Ready to stream today?
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {quickActions.map((action, index) => (
            <Link
              key={action.title}
              to={action.link}
              className={`group glass-card p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-white mb-2">{action.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{action.description}</p>
                  <div className="flex items-center text-white/60 text-sm font-medium group-hover:text-white transition-colors">
                    <span>Open</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-base font-medium hover:bg-white/90 transition-all duration-300"
          >
            Start Streaming
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
