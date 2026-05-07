import { NavLink, useNavigate } from "react-router-dom";
import { Home, Compass, Radio, User, LogOut, Tv, Bot, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/app", icon: Home, label: "Home" },
  { to: "/app/discover", icon: Compass, label: "Discover" },
  { to: "/app/dashboard", icon: Radio, label: "My Stream" },
  { to: "/app/chat-ai", icon: Bot, label: "Chat with AI" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-50"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="p-6 mb-2">
        <div className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="StreamFlow Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white font-semibold text-lg tracking-tight">
            Stream<span className="text-gray-400">Flow</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/app"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${isActive
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: user info or login */}
      <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {isLoggedIn ? (
          <div>
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.username}</p>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-all"
          >
            <User size={18} />
            Sign In
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
