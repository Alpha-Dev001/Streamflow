import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ToastProvider } from "./context/ToastContext";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/layout/Sidebar";
import ChatBot from "./components/chat/ChatBot";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Dashboard from "./pages/Dashboard";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatAI from "./pages/ChatAI";
import Settings from "./pages/Settings";
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
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const isNotFoundPage = location.pathname === '*' || location.pathname === '/404';

  return (
    <ToastProvider>
      <SocketProvider>
        <Routes>
          {/* Landing Page - Public */}
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/app" replace /> : <Landing />
          } />

          {/* Auth Pages - Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App Pages - Protected */}
          <Route
            path="/watch/:id"
            element={
              <ProtectedRoute>
                <Watch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainLayout><Home /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/discover"
            element={
              <ProtectedRoute>
                <MainLayout><Discover /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/chat-ai"
            element={
              <ProtectedRoute>
                <MainLayout><ChatAI /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout><Dashboard /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/settings"
            element={
              <ProtectedRoute>
                <MainLayout><Settings /></MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Legacy redirects */}
          <Route path="/home" element={<Navigate to="/app" replace />} />
          <Route path="/discover" element={<Navigate to="/app/discover" replace />} />
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        {!isNotFoundPage && <ChatBot />}
        <Toaster
          toastOptions={{
            style: {
              background: 'transparent',
              border: 'none',
              padding: '0',
              margin: '0',
            },
          }}
          containerStyle={{
            top: '20px',
            right: '20px',
            zIndex: 9999,
          }}
        />
      </SocketProvider>
    </ToastProvider>
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
