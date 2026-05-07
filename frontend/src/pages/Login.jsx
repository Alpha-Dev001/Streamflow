import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tv, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { error: showError, success: showSuccess } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authAPI.login(form);
      login(data.token, data.user);
      showSuccess("Welcome back! Redirecting to your dashboard...");
      setTimeout(() => navigate("/app"), 1000);
    } catch (err) {
      showError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.04) 0%, #080808 60%)",
      }}
    >
      <div className="w-full max-w-sm fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img
            src="/logo.svg"
            alt="StreamFlow Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white font-semibold text-xl tracking-tight">
            Stream<span className="text-gray-400">Flow</span>
          </span>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h1 className="text-white text-xl font-semibold mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>


          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs mb-2 block">Email</label>
              <input
                className="glass-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-2 block">Password</label>
              <div className="relative">
                <input
                  className="glass-input pr-12"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center mt-2"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-white hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
