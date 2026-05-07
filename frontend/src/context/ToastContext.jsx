import { createContext, useContext } from 'react';
import toast from 'react-hot-toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const showToast = {
    success: (message, options = {}) => toast.success(message, {
      duration: 4000,
      position: 'top-right',
      icon: '✓',
      style: {
        background: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '12px',
        fontSize: '14px',
        padding: '14px 18px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: 'rgba(16, 185, 129, 0.1)',
      },
      ...options
    }),

    error: (message, options = {}) => toast.error(message, {
      duration: 5000,
      position: 'top-right',
      icon: '✕',
      style: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ff6b6b',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '12px',
        fontSize: '14px',
        padding: '14px 18px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#000000',
        secondary: 'rgba(239, 68, 68, 0.1)',
      },
      ...options
    }),

    loading: (message, options = {}) => toast.loading(message, {
      position: 'top-right',
      style: {
        background: 'rgba(59, 130, 246, 0.1)',
        color: '#60a5fa',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
        fontSize: '14px',
        padding: '14px 18px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#60a5fa',
        secondary: 'rgba(59, 130, 246, 0.1)',
      },
      ...options
    }),

    info: (message, options = {}) => toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: 'rgba(255, 255, 255, 0.08)',
        color: '#f5f5f5',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        fontSize: '14px',
        padding: '14px 18px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#f5f5f5',
        secondary: 'rgba(255, 255, 255, 0.08)',
      },
      ...options
    }),

    dismiss: (toastId) => toast.dismiss(toastId),
    dismissAll: () => toast.dismiss(),
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
