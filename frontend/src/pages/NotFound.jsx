import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft, AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black  overflow-hidden">


      {/* Main Content */}
      <div className="text-center max-w-lg mx-auto px-4">
        {/* Error Message */}
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 text-sm mb-8">
          Oops! This page seems to have gone offline.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="glass-card inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
