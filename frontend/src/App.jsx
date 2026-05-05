import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Sidebar from "./components/layout/Sidebar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Dashboard from "./pages/Dashboard";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
};

const MainLayout = ({ children }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-64 min-h-screen">
      {children}
    </main>
  </div>
);

const AppRoutes = () => {
  return (
    <SocketProvider>
      <Routes>
        {/* Landing Page - Public */}
        <Route path="/" element={<Landing />} />

        {/* Auth Pages - Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App Pages - Protected */}
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/app" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/app/discover" element={<MainLayout><Discover /></MainLayout>} />
        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Legacy redirects */}
        <Route path="/home" element={<Navigate to="/app" replace />} />
        <Route path="/discover" element={<Navigate to="/app/discover" replace />} />
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SocketProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
